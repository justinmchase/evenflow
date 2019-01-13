import gulp from 'gulp'
import babel from 'gulp-babel'

export function build () {
  const src = [
    'src/**/*.js'
  ]
  return gulp
    .src(src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'))
}

gulp.task('build', build)
