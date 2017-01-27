import Joi from 'joi'

export default class Passthru {
  static get metadata () {
    return {
      name: 'passthru',
      inputs: {
        value: Joi.any().required()
      },
      outputs: {
        value: Joi.any().required()
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
