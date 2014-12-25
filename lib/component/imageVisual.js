/**
 * Image Visual Component - indicates path at image should be used for visual
 */

'use strict';

var VisualComponent = require('./visual');
var util = require('util');

var exports = module.exports = BoxVisualComponent;

/**
 * Constructor for ImageVisualComponent
 * @param {String} path Path describing location of image file to be used
 * @param {Object} opts  Options
 */
function BoxVisualComponent(path, opts){
  VisualComponent.call(this, opts);

  if(typeof path === 'undefined') {
    path = 'bunny.png';
  }

  this.path = 'bunny.png';
}
util.inherits(BoxVisualComponent, VisualComponent);

exports.prototype.type = 'image';
