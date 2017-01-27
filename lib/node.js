import { EventEmitter } from 'events'
import Joi from 'joi'
import { merge } from './utils'

let _dispatcher = Symbol()
let _inputs = Symbol()
let _outputs = Symbol()

export default class Node extends EventEmitter {

  constructor (name, Component, values) {
    super()
    this.name = name
    this.component = Component
    this.instance = new Component()
    this.instance.node = this
    this.values = values || {}

    let metadata = Component.metadata
    this[_inputs] = Joi.object().keys(metadata.inputs)
    this[_outputs] = Joi.object().keys(metadata.outputs)
    this.error = null
  }

  process (values) {
    merge(this.values, values)
    Joi.validate(this.values, this[_inputs], (err, value) => {
      if (err) {
        this.error = err
        if (this.listenerCount('error')) this.emit('error', err)
        return
      }
      this.instance.process(value)
    })
  }

  send (name, data) {
    this[_dispatcher].send(this, name, data)
  }

  start (dispatcher, callback) {
    this[_dispatcher] = dispatcher
    let ready = (err) => {
      if (err) return callback(err)
      this.process({})
      callback()
    }
    if (this.instance.start) this.instance.start(ready)
    else ready()
  }

  static flatten (index, components) {
    components.forEach(component => {
      if (Array.isArray(component)) return Node.flatten(index, component)
      if (typeof component !== 'function') throw new Error(`Invalid component type ${component}'`)
      if (!component) throw new Error(`Invalid component '${component}'`)
      if (!component.metadata.name) throw new Error(`Invalid component name '${component.name}'`)
      if (index[component.metadata.name]) throw new Error(`Duplicate component '${component.name}'`)
      index[component.metadata.name] = component
    })
  }

  static create (components, nodes) {
    let index = {
      components: {},
      nodes: {}
    }

    // Flatten and index the available component classes
    Node.flatten(index.components, components)

    // Flatten and index the available node instances
    Object.keys(nodes).map(name => {
      let value = nodes[name]
      let component = index.components[value.component]
      let values = value.values
      index.nodes[name] = new Node(name, component, values)
    })

    return index.nodes
  }
}
