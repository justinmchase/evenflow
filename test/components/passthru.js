
export default class Passthru {
  static get metadata () {
    return {
      name: 'passthru',
      inputs: {
        value: { type: 'any', required: true }
      },
      outputs: {
        value: { type: 'any' }
      }
    }
  }

  constructor () {
    this.started = false
  }

  start (callback) {
    this.started = true
    callback()
  }

  process (inputs) {
    this.node.send('value', inputs.value)
  }
}
