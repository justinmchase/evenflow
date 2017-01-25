import { EventEmitter } from 'events'
import parallel from 'async/parallel'
import Node from './node'
import Connection from './connection'
import { set } from './utils'

export default class Flow extends EventEmitter {
  constructor (components, flow) {
    super()
    this.components = components
    this.flow = flow
    this.nodes = Node.create(components, flow.nodes)
    this.connections = Connection.create(flow.connections, this.nodes)
    this.messages = Object.keys(flow.nodes)
      .map(name => {
        let node = flow.nodes[name]
        return {
          target: this.nodes[name],
          inputs: node.inputs
        }
      })
      .filter(n => n.inputs)

    // Set this workflow onto each node
    Object.keys(this.nodes)
      .map(name => this.nodes[name])
      .forEach(n => { n.workflow = this })
  }

  process (message, callback) {
    let target = message.target
    let inputs = message.inputs
    if (!target) throw new Error('Invalid target')
    if (!inputs) throw new Error(`Invalid inputs from ${target.component.name}`)
    target.process(inputs)
  }

  send (source, field, data) {
    if (field === 'error') {
      let err = data
      err.source = source
      this.emit('error', err)
      return
    }

    if (this.connections[source.name] && this.connections[source.name][field]) {
      let messages = this.connections[source.name][field]
        .map(connection => {
          let message = {
            target: connection.target,
            inputs: {}
          }
          set(message.inputs, connection.targetField, data)
          return message
        })

      this.messages = this.messages.concat(messages)
      if (this.messages.length === messages.length) {
        setTimeout(this.step.bind(this), 0)
      }
    }
  }

  step () {
    while (this.messages.length) {
      let message = this.messages.shift()
      this.process(message)
    }
  }

  run (callback) {
    if (this.running) throw new Error('Workflow already started')
    this.running = true

    let startable = Object.keys(this.nodes)
      .map(name => this.nodes[name])
      .map(node => node.instance)
      .filter(node => node.start)
      .map(node => node.start.bind(node))

    parallel(startable, (err) => {
      if (err) return this.emit('error', err)
      this.step()

      callback()
    })
  }
}
