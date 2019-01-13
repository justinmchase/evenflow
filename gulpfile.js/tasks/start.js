import gulp from 'gulp'
import { build } from './build'
import { test, lint } from './test'

function watch (callback) {
  gulp.watch(['src/**/*'], gulp.series(build, test(false), lint(false)))
  gulp.watch(['gulpfile.js/**/*'], lint(false))
}

gulp.task('start', gulp.parallel(
  gulp.series(
    build,
    test(false),
    lint(false)
  ),
  watch
))
