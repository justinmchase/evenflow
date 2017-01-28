import gulp from 'gulp'
import mocha from 'gulp-mocha'
import standard from 'gulp-standard'

function test () {
  return gulp
    .src('test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'min',
      require: ['babel-register']
    }))
}

function lint () {
  let src = [
    '**/*.js',
    '!node_modules/**/*'
  ]
  return gulp
    .src(src)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
}

gulp.task('test', gulp.series(test, lint))
