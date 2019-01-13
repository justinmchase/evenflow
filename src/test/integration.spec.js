import { underscore, humanize } from 'inflection'
import evenflow from '../lib'
import components from './components'
import * as integration from './integration'

describe('integration tests:', () => {
  Object.entries(integration).forEach(([name, test]) => {
    const { flow, expectation } = test
    it(humanize(underscore(name), true), (done) => {
      evenflow(components, flow, (err, flow) => {
        if (err) return done(err)
        flow.on('idle', () => {
          flow.serialize().should.deep.equal(expectation)
          flow.stop()
          done()
        })
        flow.run()
      })
    })
  })
})
