import Joi from 'joi'

export default class Passthru {
  static get metadata () {
    return {
      name: 'passthru',
      inputs: {
        value: Joi.any().required().invalid(null)
      },
      outputs: {
        value: Joi.any().required()
      }
    }
  }

  process (inputs) {
    this.node.send('value', inputs.value)
  }
}
