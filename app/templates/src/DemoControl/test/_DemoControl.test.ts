/// <reference path="../typings/tsd.d.ts" />

import chai = require("chai");

import View = require('../onejs/View');
import ViewModel = require('../onejs/ViewModel');
import DemoControlBase = require("../DemoControl/DemoControlBase");
import DemoControlModel = require("../DemoControl/DemoControlModel");

var assert = chai.assert;

describe('DemoControl', () => {
    describe('constructor', () => {
        var vmInstance: DemoControlModel;
        beforeEach(() => {
            vmInstance = new DemoControlModel();
        });

        it('should be a viewmodel', () => {
            assert.strictEqual(vmInstance.isViewModel, true);
        })
    });
});
