'use strict';

var gulp = require('gulp');
var onejsCompiler = require('gulp-onejs-compiler');
var tsc = require('gulp-typescript');
var del = require('del');
var uglify = require('gulp-uglifyjs');
var less = require('gulp-less');
var cssMinify = require('gulp-minify-css');
var csstojs = require('gulp-csstojs');
var filter = require('gulp-filter');
var size = require('gulp-size');
var mergeStream = require('merge-stream');
var karma = require('karma').server;

/** The paths we'll be using for our build system */
var paths = {
    tempPath: 'temp',
    appPath: 'app',
    appAmdPath: 'app/amd',
    appCommonJsPath: 'app/commonjs',
    appMinPath: 'app-min',
    staticFiles: ['node_modules/requirejs/require.js'],
    testBinPath: 'bin'
};

/** What standard of ECMAScript we will target for TypeScript compilation */
var esTarget = 'ES5';

/** What dependencies we'll need to manually handle */
var dependencies = [
    'onejs',
];

/** Cleans both app and test output files */
gulp.task('clean', ['clean-app', 'clean-test'], function() {

});

/** Cleans app source related files */
gulp.task('clean-app', function(cb) {
    del([paths.tempPath, paths.appPath, paths.appMinPath], cb);
});

/** Cleans test related files */
gulp.task('clean-test', function(cb) {
    del([paths.testBinPath], cb);
});

/** Runs LESS compiler, CSS to JS, OneJS Compiler and outputs to temp folder */
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

/** Takes the TS from the temp folder and compiles it to AMD JS */
gulp.task('tsc', ['tsc-preprocess'], function() {
    return gulp.src(paths.tempPath + '/ts/**/*.ts')
        .pipe(tsc({
            module: 'amd',
            target: esTarget
        }))
        .pipe(gulp.dest(paths.appAmdPath));
});

/** Takes the TS from the temp folder and compiles it to CommonJS */
gulp.task('tsc-commonjs', ['tsc-preprocess'], function() {
    return gulp.src([
            paths.tempPath + '/ts/**/*.ts',
            '!' + paths.tempPath + '/ts/{test,test/**}' // Do not match test files
        ])
        .pipe(tsc({
            module: 'commonjs',
            target: esTarget
        }))
        .pipe(gulp.dest(paths.appCommonJsPath))
        .pipe(gulp.dest(paths.testBinPath));
});

/** Minifies and gzips your application */
gulp.task('minify', ['tsc'], function() {
    return gulp.src([paths.appPath + '/**/*.js'])
        .pipe(uglify())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest(paths.appMinPath));
});

/** Copies dependencies */
gulp.task('copy-deps', ['copy-dts'], function() {
    var stream = mergeStream();

    for (var i = 0; i < dependencies.length; i++) {
        var dep = dependencies[i];

        stream.add(
            gulp.src('node_modules/' + dep + '/dist/amd/*')
            .pipe(gulp.dest(paths.tempPath + '/ts/' + dep))
            .pipe(gulp.dest(paths.appPath + '/' + dep))
            .pipe(gulp.dest(paths.testBinPath + '/onejs'))
        );
    }

    return stream;
});

/** Copies the distributable js files of your app into the bin folder */
gulp.task('copy-dist', ['tsc-commonjs'], function() {
    return gulp.src(paths.appCommonJsPath + '/*.js')
        .pipe(gulp.dest('bin/src'));
});

/** Copies the .d.ts files to the temp folder */
gulp.task('copy-dts', function() {
    return gulp.src('typings/**/*.d.ts')
        .pipe(gulp.dest(paths.tempPath + '/ts/typings'))
        .pipe(gulp.dest(paths.testBinPath + '/typings'));
});

/** Builds source and test files */
gulp.task('tsc-test', ['tsc-commonjs', 'test-preprocess'], function() {
    var tsResult = gulp.src(paths.tempPath + '/ts/test/*.ts')
        .pipe(tsc({
            module: 'commonjs',
            target: esTarget
        }));

    return tsResult.js.pipe(gulp.dest('bin/test'));
});

/** Copies the test files to the temp path */
gulp.task('test-preprocess', ['copy-static-test-files'], function() {
    return gulp.src(['test/*.ts'])
        .pipe(gulp.dest(paths.tempPath + '/ts/test'));
});

/** Runs the test suite on your test cases */
gulp.task('test', ['tsc-test'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

// karma blocks gulp from exiting without this
gulp.doneCallback = function(err) {
    process.exit(err? 1: 0);
};

/** Copies the static files required for your app */
gulp.task('copy-static-files', function() {
    return gulp.src(paths.staticFiles)
        .pipe(gulp.dest(paths.appPath))
        .pipe(uglify())
        .pipe(gulp.dest(paths.appMinPath));
});

/** Copies the static files required for your app */
gulp.task('copy-static-test-files', function() {
    return gulp.src(paths.staticFiles)
        .pipe(gulp.dest(paths.testBinPath));
});

gulp.task('serve', ['default'], function() {

});

/** Watches your source folder for changes and runs the default task */
gulp.task('watch', function() {
    gulp.watch('src/**/*', ['default']);
});

gulp.task('default', ['tsc', 'minify', 'copy-static-files']);
