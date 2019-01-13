const idle = Symbol('whether or not the dispatcher is idle')
const running = Symbol('whether or not the dispatcher is running')
const timer = Symbol('a reference to the timer')
const sink = Symbol('a reference to the event sink')
const emit = Symbol('a reference to the emitter')

export default class Dispatcher {
  // States
  // - idle
  // - running
  //
  // Events
  // - running
  // - awake
  // - idle
  // - stopped
  // - sending
  // - processing
  // - error
  constructor (connections, eventSink) {
    this.messages = []
    this.connections = connections
    this[sink] = eventSink
    this[emit] = function (event, data) {
      if (this[sink] && this[sink].listenerCount(event)) {
        this[sink].emit(event, data)
      }
    }
  }

  get idle () {
    return this[idle]
  }

  get running () {
    return this[running]
  }

  process (message) {
    let target = message.target
    let inputs = message.inputs
    if (!target) throw new Error('Invalid target')
    if (!inputs) throw new Error(`Invalid inputs from ${target.component.name}`)
    target.process(inputs)
    this[emit]('processed', message)
  }

  send (source, field, data) {
    if (this.connections[source.name] && this.connections[source.name][field]) {
      this.connections[source.name][field].forEach(connection => {
        let message = {
          target: connection.target,
          inputs: {}
        }
        message.inputs[connection.targetField] = data
        this.messages.push(message)
        this[emit]('sending', { message, connection })
      })
    }

    // Errors are also emitted as special events globally
    if (field === 'error') {
      let err = data
      err.source = source
      this.emit('error', err)
    }

    if (this[running] && this[idle] && this.messages.length) {
      // If we were idle but new messages have been added to the queue
      // then start stepping again
      this[timer] = setInterval(this.step.bind(this), 0)
      this[idle] = false
      this[emit]('awake')
    }
  }

  step () {
    if (this.messages.length) {
      let message = this.messages.shift()
      this.process(message)
    } else if (this[running] && !this[idle]) {
      this[idle] = true
      clearInterval(this[timer])
      this[timer] = null
      this[emit]('idle')
    }
  }

  run () {
    if (!this[running]) {
      this[running] = true
      if (this.messages.length) {
        this[timer] = setInterval(this.step.bind(this), 0)
        this[idle] = false
        this[emit]('running')
        this[emit]('awake')
      } else {
        this[idle] = true
        this[emit]('running')
        this[emit]('idle')
      }
    }
  }

  stop () {
    if (this[running]) {
      clearInterval(this[timer])
      this[timer] = null
      this[running] = false
      if (!this[idle]) {
        this[idle] = true
        this[emit]('idle')
      }
      this[emit]('stopped')
    }
  }
}
