import { EventEmitter } from 'events'
import parallel from 'async/parallel'
import Dispatcher from './dispatcher'
import Node from './node'
import Connection from './connection'

let started = Symbol('whether or not this flow has been started')
let dispatcher = Symbol('a reference to the dispatcher')

export default class Flow extends EventEmitter {
  constructor (components, flow) {
    super()
    this.flow = flow
    this.components = components
    this.nodes = Node.create(this.components, flow.nodes)
    this.connections = Connection.create(this.nodes, flow.connections)
    this[dispatcher] = new Dispatcher(this.connections, this)
  }

  serialize () {
    let messages = this[dispatcher].messages
    let nodes = Object.values(this.nodes).map(n => {
      return {
        name: n.name,
        values: n.values
      }
    })
    return {
      nodes,
      messages
    }
  }

  start (callback) {
    if (this[started]) throw new Error('Workflow already started')
    this[started] = true

    let startable = Object.keys(this.nodes)
      .map(name => this.nodes[name])
      .map(node => (callback) => node.start(this[dispatcher], callback))

    parallel(startable, (err) => {
      if (err) return this.emit('error', err)
      if (callback) callback(null, this)
      if (this.listenerCount('ready')) this.emit('ready', this)
    })
  }

  run () {
    this[dispatcher].run()
  }

  stop () {
    this[dispatcher].stop()
  }

  step () {
    this[dispatcher].step()
  }
}
