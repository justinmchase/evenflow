import { EventEmitter } from 'events'
import { set } from './utils'

export default class Dispatcher extends EventEmitter {

  constructor (nodes, connections) {
    super()
    this.nodes = nodes
    this.connections = connections
    this.messages = []
  }

  process (message) {
    let target = message.target
    let inputs = message.inputs
    if (!target) throw new Error('Invalid target')
    if (!inputs) throw new Error(`Invalid inputs from ${target.component.name}`)
    target.process(inputs)
    if (this.listenerCount('message')) this.emit('message', message)
  }

  send (source, field, data) {
    if (field === 'error') {
      let err = data
      err.source = source
      this.emit('error', err)
      return
    }

    if (this.connections[source.name] && this.connections[source.name][field]) {
      this.connections[source.name][field].forEach(connection => {
        let message = {
          target: connection.target,
          inputs: {}
        }
        set(message.inputs, connection.targetField, data)
        this.messages.push(message)
      })
    }
  }

  step () {
    if (this.messages.length) {
      let message = this.messages.shift()
      this.process(message)
    }
  }

  run () {

  }

  stop () {

  }

}
