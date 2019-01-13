import Joi from 'joi'

export default class And {
  static get metadata () {
    return {
      name: 'and',
      inputs: {
        left: Joi.any(),
        right: Joi.any()
      },
      outputs: {
        value: Joi.boolean().required()
      }
    }
  }

  process (inputs) {
    let value = inputs.left && inputs.right
    this.node.send('value', value)
  }
}
