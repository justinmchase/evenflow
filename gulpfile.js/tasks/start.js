import gulp from 'gulp'
import mocha from 'gulp-mocha'


function test () {
  let ended = false
  let testStream = gulp
    .src('./test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'nyan',
      require: ['babel-register']
    }))
    .on('error', (err) => {
      process.stderr.write(`${err.message}\n`)
      setTimeout(() => { if (!ended) testStream.emit('end') }, 50)
    })
    .on('end', () => { ended = true })

  return testStream
}

function watch (callback) {
  gulp.watch(['lib/**/*', 'test/**/*'], test)
  callback()
}

gulp.task('start', gulp.parallel(
  test,
  watch
))
