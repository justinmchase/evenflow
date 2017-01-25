import gulp from 'gulp'
import mocha from 'gulp-mocha'

function test () {
  return gulp
    .src('./test/**/*.js', { read: false })
    .pipe(mocha({
      reporter: 'nyan',
      require: ['babel-register']
    }))
}

gulp.task('test', test)