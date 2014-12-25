/**
 * Box Visual Component - indicates a box should be used for visual
 */

'use strict';

var VisualComponent = require('./visual');
var util = require('util');

var exports = module.exports = BoxVisualComponent;

/**
 * Constructor for BoxVisualComponent
 * @param {Number} color number describing color of box
 * @param {Object} opts  Options
 */
function BoxVisualComponent(color, opts){
  VisualComponent.call(this, opts);

  if(typeof color === 'undefined') {
    color = 0xff0000;
  }

  this.color = color;
}
util.inherits(BoxVisualComponent, VisualComponent);

exports.prototype.type = 'box';
