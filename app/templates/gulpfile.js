'use strict';

var gulp = require('gulp');
var onejsCompiler = require('gulp-onejs-compiler');
var tsc = require('gulp-typescript');
var clean = require('gulp-rimraf');
var uglify = require('gulp-uglifyjs');
var add = require('gulp-add-src');
var less = require('gulp-less');
var cssMinify = require('gulp-minify-css');
var csstojs = require('gulp-csstojs');
var filter = require('gulp-filter');
var size = require('gulp-size');
var mergeStream = require('merge-stream');
var karma = require('karma').server;

var paths = {
    tempPath: 'temp',
    appPath: 'app',
    appMinPath: 'app-min',
    staticFiles: ['node_modules/requirejs/require.js']
};

var amdDependencies = [
    'onejs'
];

gulp.task('clean', function() {
    return gulp.src([paths.tempPath, paths.appPath, paths.appMinPath])
        .pipe(clean());
});

gulp.task('copy-deps', ['clean'], function() {
    var stream = mergeStream();

    for (var i = 0; i < amdDependencies.length; i++) {
        var dep = amdDependencies[i];

        stream.add(
            gulp.src('node_modules/' + dep + '/dist/amd/*')
            .pipe(gulp.dest(paths.tempPath + '/ts/' + dep))
            .pipe(gulp.dest(paths.appPath + '/' + dep))
        );
    }

    return stream;
});

gulp.task('tsc-preprocess', ['copy-deps'], function() {
    var lessFilter = filter('**/*.less');

    return gulp.src(['src/**/*'])
        .pipe(lessFilter)
        .pipe(less())
        .pipe(cssMinify())
        .pipe(csstojs({
            typeScript: true
        }))
        .pipe(lessFilter.restore())
        .pipe(onejsCompiler())
        .pipe(gulp.dest(paths.tempPath + '/ts'));
});

gulp.task('tsc', ['tsc-preprocess'], function() {
    return gulp.src(paths.tempPath + '/ts/**/*.ts')
        .pipe(tsc({
            module: 'amd'
        }))
        .pipe(gulp.dest(paths.appPath));
});

gulp.task('minify', ['tsc'], function() {
    return gulp.src([paths.appPath + '/*.js'])
        .pipe(uglify())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest(paths.appMinPath));
});

gulp.task('copy-dist', ['tsc-commonjs'], function() {
    return gulp.src('dist/commonjs/*.js')
        .pipe(gulp.dest('bin/src'));
});

gulp.task('tsc-test', ['clean-test', 'copy-dist'], function() {
    var tsResult = gulp.src('test/*.ts')
        .pipe(tsc({
            module: 'commonjs',
            target: 'ES5'
        }));

    return tsResult.js.pipe(gulp.dest('bin/test'));
});

gulp.task('test', ['tsc-test'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('copy-static-files', ['clean', 'tsc'], function() {
    return gulp.src(paths.staticFiles)
        .pipe(gulp.dest(paths.appPath))
        .pipe(uglify())
        .pipe(gulp.dest(paths.appMinPath));
});

gulp.task('serve', ['default'], function() {

});

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['default']);
});

gulp.task('default', ['tsc', 'minify', 'copy-static-files']);
