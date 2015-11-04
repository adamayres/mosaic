'use strict';

var gulp = require('gulp');
var csslint = require('gulp-csslint');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var zip = require('gulp-zip');
var sftp = require('gulp-sftp');

var config = {
  dev: 'dev',
  build: 'build',
  port: 1881
};

gulp.task('jshint', function() {
  return gulp.src(['gulpFile.js', 'dev/assets/scripts/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('csslint', function() {
  return gulp.src(['dev/assets/styles/*.css'])
    .pipe(prefix('last 3 version', '> 1%', {
      cascade: true
    }))
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('connect-dev', function() {
  connect.server({
    root: config.dev,
    port: config.port,
    livereload: true
  });
});

gulp.task('connect-prod', function() {
  connect.server({
    root: config.build,
    port: config.port
  });
});

gulp.task('reload', function() {
  return gulp.src([
      config.dev + '/**/*.html',
      '!' + config.dev + '/assets/**'
    ])
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([
    config.dev + '/assets/styles/*.scss',
  ], ['sass-dev', 'csslint']);

  gulp.watch([
    'gulpFile.js',
    config.dev + '/assets/scripts/**/*.js'
  ], ['jshint', 'reload']);

  gulp.watch([
    config.dev + '/*.html',
    config.dev + '/templates/**/*.html',
    config.dev + '/images/**/*'
  ], ['reload']);
});

gulp.task('html-parser', function() {

  return gulp.src([config.dev + '/**/*.html', '!' + config.dev + '/assets/lib/**', '!' + config.dev + '/templates/**'])
    .pipe(useref())
    .pipe(gulp.dest(config.build));
});

gulp.task('assets-parser', function() {
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');

  return gulp.src([config.dev + '/**/*.html', '!' + config.dev + '/assets/lib/**', '!' + config.dev + '/templates/**'])
    .pipe(useref.assets())
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
    .pipe(gulp.dest(config.build));
});

gulp.task('template-parser', function() {
  console.log('Building template files.. This might take a few minutes..');
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');

  return gulp.src([config.dev + '/**/*.html', '!' + config.dev + '/assets/lib/**'])
    .pipe(useref.assets())
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(minifyCss())
    .pipe(cssFilter.restore())
    .pipe(useref.restore())
    .pipe(useref())
    .pipe(gulp.dest(config.build));
});

gulp.task('imagemin', function() {
  return gulp.src(config.dev + '/assets/images/**')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngcrush()]
    }))
    .pipe(gulp.dest(config.build + '/assets/images'));
});

gulp.task('fonts', function() {
  return gulp.src(config.dev + '/assets/fonts/**')
    .pipe(gulp.dest(config.build + '/assets/fonts'));
});

gulp.task('sass-dev', function() {
  return gulp.src(config.dev + '/assets/styles/**/*.scss')
    .pipe(sass({
      sourcemap: false,
      trace: true,
      style: 'expanded',
      precision: 5,
      debugInfo: false,
      lineNumbers: true
    }))
    .pipe(prefix('last 3 version', '> 1%', {
      cascade: true
    }))
    .pipe(gulp.dest(config.dev + '/assets/styles/'))
    .pipe(connect.reload());
});

gulp.task('sass-prod', function() {
  return gulp.src(config.dev + '/assets/styles/**/*.scss')
    .pipe(sass())
    .pipe(prefix('last 3 version', '> 1%', {
      cascade: false
    }))
    .pipe(gulp.dest(config.dev + '/assets/styles/'));
});

var filelog = require('gulp-filelog');

gulp.task('zip', ['sass-prod', 'imagemin', 'fonts', 'html-parser', 'assets-parser'], function () {
  return gulp.src(['build/**/*.*', '!build/build.zip'])
    .pipe(filelog())
    .pipe(zip('build.zip'))
    .pipe(gulp.dest('build'));
});

gulp.task('deploy', ['build'], function () {
  var dest = '/home/mosaicproject.org/domains/wp.mosaicproject.org/htdocs';

  return gulp.src(['build/**', '!build/build.zip'], {
    buffer: false
  }).pipe(sftp({
    host: 'ftp.skyhouseconsulting.com',
    user: 'mosaicproject.org',
    pass: '',
    remotePath: dest
  }));
});

gulp.task('default', ['sass-dev', 'connect-dev', 'watch']);
gulp.task('build-templates', ['sass-prod', 'imagemin', 'fonts', 'template-parser']);
gulp.task('build', ['sass-prod', 'imagemin', 'fonts', 'html-parser', 'assets-parser']);
gulp.task('prod', ['connect-prod']);
