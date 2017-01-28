import evenflow from '../lib'
import passthru from './components/passthru'
import sinon from 'sinon'
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
        values: {
          value: 'test-data'
        }
      },
      'two': {
        component: 'passthru'
      }
    },
    connections: [
      {
        source: { node: 'one', field: 'value' },
        target: { node: 'two', field: 'value' }
      }
    ]
  }
  let sandbox = sinon.sandbox.create()
  let messages = sinon.stub()
  let errors = sinon.stub()
  let flow = null
  beforeEach((done) => {
    evenflow(components, document, (err, f) => {
      flow = f
      flow.on('message', messages)
      flow.on('error', errors)
      done(err)
    })
  })
  afterEach(() => sandbox.restore())

  it('should load the correct nodes', () => {
    flow.nodes['one'].should.be.ok
    flow.nodes['two'].should.be.ok
  })
  it('should start all components', () => {
    flow.nodes['one'].instance.started.should.be.true
    flow.nodes['two'].instance.started.should.be.true
  })
  it('should set values onto one', () => {
    flow.nodes['one'].values.should.deep.equal({ value: 'test-data' })
  })
  describe('after taking a step', () => {
    beforeEach(() => flow.step())
    it('should send the message to two', () => {
      flow.nodes['two'].values.should.deep.equal({ value: 'test-data' })
    })
  })
})
