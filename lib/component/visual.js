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
 */
function VisualComponent(image, opts){
  Component.call(this, opts);

  image = image || {};

  var defaultImage = {
    type: 'image',
    path: 'bunny.png',
    anchor: {x: 0.5, y: 0.5}
  };

  _.extend(this.image, {}, defaultImage, image);
}
util.inherits(VisualComponent, Component);

exports.prototype.name = 'visual';
