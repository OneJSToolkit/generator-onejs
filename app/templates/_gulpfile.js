'use strict';

var gulp = require('gulp');
var oneJs = require('gulp-onejs-compiler');
var karma = require('karma').server;

oneJs.gulpTasks.all({
    gulp: gulp,
    rootDir: __dirname,
    karma: karma
});
