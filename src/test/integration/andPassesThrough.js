export default {
  flow: {
    nodes: {
      one: { component: 'passthru', values: { value: true } },
      two: { component: 'passthru', values: { value: true } },
      three: { component: 'and' },
      four: { component: 'passthru' }
    },
    connections: [
      {
        source: { node: 'one', field: 'value' },
        target: { node: 'three', field: 'left' }
      },
      {
        source: { node: 'two', field: 'value' },
        target: { node: 'three', field: 'right' }
      },
      {
        source: { node: 'three', field: 'value' },
        target: { node: 'four', field: 'value' }
      }
    ]
  },
  expectation: {
    messages: [],
    nodes: [
      { name: 'one', values: { value: true } },
      { name: 'two', values: { value: true } },
      { name: 'three', values: { left: true, right: true } },
      { name: 'four', values: { value: true } }
    ]
  }
}
