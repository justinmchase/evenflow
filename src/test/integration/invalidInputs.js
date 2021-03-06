export default {
  flow: {
    nodes: {
      one: { component: 'passthru', values: { value: null } },
      two: { component: 'passthru' }
    },
    connections: [
      {
        source: { node: 'one', field: 'value' },
        target: { node: 'two', field: 'value' }
      }
    ]
  },
  expectation: {
    messages: [],
    nodes: [
      { name: 'one', values: { value: null } },
      { name: 'two', values: { } }
    ]
  }
}
