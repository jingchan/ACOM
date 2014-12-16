/**
 * ## Base by Image
 * A quick-and-dirty wrapper of a grid-based entity that we define with an imagepath. Meant to be
 * more lightweight than player.js
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = BaseByImage;

function BaseByImage(x, y, imagepath){
  base.call(this, x, y);
	this.position = {x: x, y: y};

  // it looks like this will be depreciated after Jing gets the visualComponent thing working.
  this.image = {
    type:'image',
    path:imagepath,
    anchor:{x:0.5, y:0.5}
  };
}
util.inherits(BaseByImage, base);

exports.prototype.update = function(){

};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
