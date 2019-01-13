export default {
  flow: {
    nodes: {
      one: { component: 'passthru', values: { value: true } },
      two: { component: 'passthru', values: { value: false } },
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
      { name: 'two', values: { value: false } },
      { name: 'three', values: { left: true, right: false } },
      { name: 'four', values: { value: false } }
    ]
  }
}
