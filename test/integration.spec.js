import fs from 'fs'
import path from 'path'
import evenflow from '../lib'
import components from './components'
import chai from 'chai'
chai.should()

function getFiles (dir) {
  let items = []
  fs.readdirSync(dir)
    .map(item => path.join(dir, item))
    .map(item => {
      let stat = fs.statSync(item)
      if (stat.isFile() && path.extname(item) === '.json') {
        items.push({
          name: path.basename(item),
          content: JSON.parse(fs.readFileSync(item, 'utf8'))
        })
      } else if (stat.isDirectory()) {
        getFiles(item).forEach(i => items.push(i))
      }
    })

  return items
}

describe('integration tests', () => {
  getFiles(path.join(__dirname, 'integration')).forEach(file => {
    let name = file.name
    let flow = file.content.flow
    let expectation = file.content.expectation
    it(name, (done) => {
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
