/**
 * Visual Component - adds visual element
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');
var _ = require('underscore');

var exports = module.exports = VisualComponent;

/**
 * Constructor for visual
 * @renderer
 * @spriteHandle a string that tells us what sprite to use. Right now this is
 *               the string that Phaser uses to index sprites
 */
function VisualComponent(opts){
  Component.call(this, opts);

}

util.inherits(VisualComponent, Component);

exports.prototype.name = 'visual';
