import Joi from 'joi'
import Enjoi from 'enjoi'
import { merge } from './utils'

let schemaOptions = {
  types: {
    any: Joi.any().required()
  }
}

export default class Node {

  constructor (name, Component) {
    this.name = name
    this.component = Component
    this.instance = new Component()
    this.instance.node = this
    this.values = {}

    let metadata = Component.metadata
    let inputSchema = {
      title: `${metadata.name} inputs`,
      type: 'object',
      properties: metadata.inputs
    }
    let outputSchema = {
      title: `${metadata.name} outputs`,
      type: 'object',
      properties: metadata.outputs
    }
    this.inputs = Enjoi(inputSchema, schemaOptions)
    this.outputs = Enjoi(outputSchema, schemaOptions)
    this.errors = []
  }

  process (inputs) {
    merge(this.values, inputs)
    Joi.validate(this.values, this.inputs, (err, value) => {
      if (!err) this.instance.process(value)
    })
  }

  send (name, data) {
    this.workflow.send(this, name, data)
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
      let inputs = value.inputs
      index.nodes[name] = new Node(name, component, inputs)
    })

    return index.nodes
  }
}
