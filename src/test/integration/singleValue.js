export default {
  flow: {
    nodes: {
      one: {
        component: 'passthru',
        values: {
          value: 'test-data'
        }
      },
      two: {
        component: 'passthru'
      }
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
      { name: 'one', values: { value: 'test-data' } },
      { name: 'two', values: { value: 'test-data' } }
    ]
  }
}
