export default class Connection {
  constructor (source, target, sourceField, targetField) {
    this.source = source
    this.target = target
    this.sourceField = sourceField
    this.targetField = targetField
  }

  static create (nodes, connections) {
    let sources = {}
    connections.map(connection => {
      let source = nodes[connection.source.node]
      let target = nodes[connection.target.node]
      let sourceField = connection.source.field
      let targetField = connection.target.field
      let instance = new Connection(source, target, sourceField, targetField)

      if (!sources[source.name]) sources[source.name] = {}
      if (!sources[source.name][sourceField]) sources[source.name][sourceField] = []
      sources[source.name][sourceField].push(instance)
    })

    return sources
  }
}
