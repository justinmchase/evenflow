import Flow from '../lib/flow'
import passthru from './components/passthru'
import chai from 'chai'
chai.should()

describe('integration tests', () => {
  let components = [
    passthru
  ]
  let document = {
    nodes: {
      'one': {
        component: 'passthru',
        inputs: {
          in: 'test-data'
        }
      },
      'two': {
        component: 'passthru'
      }
    },
    connections: [
      {
        source: { node: 'one', field: 'out' },
        target: { node: 'two', field: 'in' }
      }
    ]
  }
  let flow = null
  beforeEach((done) => {
    flow = new Flow(components, document)
    flow.run(done)
  })

  it('should load a correct nodes', () => {
    flow.nodes['one'].should.be.ok
    flow.nodes['two'].should.be.ok
  })
  it('should start a component', () => {
    flow.nodes['one'].instance.started.should.be.true
    flow.nodes['two'].instance.started.should.be.true
  })
})
