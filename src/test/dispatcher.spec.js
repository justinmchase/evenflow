import { EventEmitter } from 'events'
import Dispatcher from '../lib/dispatcher'
import sinon from 'sinon'
import chai from 'chai'

chai.should()

describe('dispatcher:', () => {
  let dispatcher = null
  let connections = null
  let one = null
  let two = null
  let sink = null
  beforeEach(() => {
    one = { name: 'one', process: sinon.stub() }
    two = { name: 'two', process: sinon.stub() }
    connections = {
      one: { value: [{ target: two, targetField: 'value' }] }
    }
    sink = new EventEmitter()
    dispatcher = new Dispatcher(connections, sink)
  })

  describe('events:', () => {
    let handler = null
    beforeEach(() => {
      handler = sinon.stub()
    })
    it('emits "sending" on send', () => {
      sink.on('sending', handler)
      dispatcher.send(one, 'value', sinon.stub())
      handler.calledOnce.should.be.true()
    })
    it('emits "processed" on step', () => {
      sink.on('processed', handler)
      dispatcher.send(one, 'value', sinon.stub())
      dispatcher.step()
      handler.calledOnce.should.be.true()
    })
  })
  it('emits "running" when run', (done) => {
    let running = sinon.stub()
    sink.on('running', running)
    sink.on('idle', () => {
      running.calledOnce.should.be.true()
      done()
    })
    dispatcher.run()
  })
  describe('not running:', () => {
    it('can step', () => {
      dispatcher.step()
    })
    it('can stop', () => {
      dispatcher.stop()
    })
    describe('with a single message:', () => {
      let value = null
      beforeEach(() => {
        value = sinon.stub()
        dispatcher.send(one, 'value', value)
      })
      it('has a pending message', () => {
        dispatcher.messages.length.should.equal(1)
      })
      it('a single step processes', () => {
        dispatcher.step()
        two.process.calledOnce.should.be.true()
      })
      it('sends the correct value', () => {
        dispatcher.step()
        two.process.calledWith({ value }).should.be.true()
      })
      it('emits "awake" when run', (done) => {
        let awake = sinon.stub()
        sink.on('awake', awake)
        sink.on('idle', () => {
          awake.calledOnce.should.be.true()
          done()
        })
        dispatcher.run()
      })
    })
  })
  describe('running:', () => {
    beforeEach(() => {
      dispatcher.run()
    })
    it('is idle', () => {
      dispatcher.idle.should.be.true()
    })
    it('is running', () => {
      dispatcher.running.should.be.true()
    })
    it('is not running after being stopped', () => {
      dispatcher.stop()
      dispatcher.running.should.be.false()
    })
    it('is idle after stopped', () => {
      dispatcher.stop()
      dispatcher.idle.should.be.true()
    })
    it('processes a message', (done) => {
      let value = sinon.stub()
      sink.on('processed', message => {
        message.inputs.value.should.equal(value)
        done()
      })
      dispatcher.send(one, 'value', value)
    })
    it('processes multiple messages', (done) => {
      let value = sinon.stub()
      let processed = sinon.stub()
      sink.on('processed', processed)
      sink.on('idle', () => {
        processed.calledTwice.should.be.true()
        done()
      })
      dispatcher.send(one, 'value', value)
      dispatcher.send(one, 'value', value)
    })

    it('stopping does not process remaining messages', (done) => {
      let value = sinon.stub()
      sink.on('processed', () => {
        dispatcher.stop()
      })
      sink.on('idle', () => {
        two.process.calledOnce.should.be.true()
        done()
      })
      dispatcher.send(one, 'value', value)
      dispatcher.send(one, 'value', value)
    })
  })
})
