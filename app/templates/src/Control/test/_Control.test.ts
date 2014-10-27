/// <reference path="../typings/tsd.d.ts" />

import chai = require("chai");

import View = require('../onejs/View');
import ViewModel = require('../onejs/ViewModel');
import <%= viewName %>Base = require("../<%= viewName %>/<%= viewName %>Base");
import <%= viewName %>Model = require("../<%= viewName %>/<%= viewName %>Model");

var assert = chai.assert;

describe('<%= viewName %>', () => {
    describe('constructor', () => {
        var vmInstance: <%= viewName %>Model;
        beforeEach(() => {
            vmInstance = new <%= viewName %>Model();
        });

        it('should be a viewmodel', () => {
            assert.strictEqual(vmInstance.isViewModel, true);
        })
    });
});
