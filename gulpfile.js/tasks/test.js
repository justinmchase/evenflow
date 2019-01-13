import gulp from 'gulp'
import mocha from 'gulp-mocha'
import standard from 'gulp-standard'

function error (breakOnError) {
  return function handler (err) {
    process.stderr.write(`${err.message}\n`)
    if (!breakOnError) this.emit('end')
  }
}

export function test (breakOnError = true) {
  return function test () {
    return gulp
      .src('dist/test/**/*.spec.js', { read: false })
      .pipe(mocha({
        reporter: 'list'
      }))
      .on('error', error(breakOnError))
  }
}

export function lint (breakOnError = true) {
  return function lint () {
    let src = [
      'src/**/*.js',
      'gulpfile.js/**/*.js'
    ]
    return gulp
      .src(src)
      .pipe(standard())
      .pipe(standard.reporter('default', {
        quiet: true,
        breakOnError
      }))
      .on('error', error(breakOnError))
  }
}

gulp.task('test', gulp.series(
  test(),
  lint()
))
