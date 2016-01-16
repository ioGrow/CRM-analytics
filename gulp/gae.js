'use strict';

var gulp = require('gulp'),
    gae = require('gulp-gae'),
    conf = require('./conf');

gulp.task('gae-run', function () {
    gulp.src('app/app.yaml')
        .pipe(gae('dev_appserver.py', [], {
            port: 8070,
            host: 'localhost',
            admin_port: 8001,
            admin_host: 'localhost',
            storage_path: conf.paths.storage_dir,
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
