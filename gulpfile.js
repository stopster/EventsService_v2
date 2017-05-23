const gulp = require('gulp');
const server = require('gulp-develop-server');
const jshint = require('gulp-jshint');


gulp.task('lint', () => {
  return gulp.src(['app.js', './controllers/*', './helpers/*', './middlewares/*', './models/*'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

gulp.task('server:start', () => {
  server.listen({path: './app.js'});
});

gulp.task('server:restart', () => {
  gulp.watch(['./app.js', './controllers/*', './middleware/*'], server.restart);
});

gulp.task('default', ['lint', 'server:start', 'server:restart']);
