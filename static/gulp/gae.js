'use strict';

var gulp = require('gulp'),
  gae = require('gulp-gae');

gulp.task('gae-serve', function () {
  gulp.src('../app.yaml')
    .pipe(gae('dev_appserver.py', [], {
      port: 8070,
      host: 'localhost',
      admin_port: 8001,
      admin_host: 'localhost'
    }));
});


gulp.task('gae-deploy', function () {
  gulp.src('app/app.yaml')
    .pipe(gae('appcfg.py', ['update'], {
      version: 'dev',
      oauth2: undefined // for value-less parameters
    }));
});


gulp.task('default', ['gae-serve']);
