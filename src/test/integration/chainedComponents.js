export default {
  flow: {
    nodes: {
      one: {
        component: 'passthru',
        values: {
          value: 'test-data'
        }
      },
      two: { component: 'passthru' },
      three: { component: 'passthru' }
    },
    connections: [
      {
        source: { node: 'one', field: 'value' },
        target: { node: 'two', field: 'value' }
      },
      {
        source: { node: 'two', field: 'value' },
        target: { node: 'three', field: 'value' }
      }
    ]
  },
  expectation: {
    messages: [],
    nodes: [
      { name: 'one', values: { value: 'test-data' } },
      { name: 'two', values: { value: 'test-data' } },
      { name: 'three', values: { value: 'test-data' } }
    ]
  }
}
