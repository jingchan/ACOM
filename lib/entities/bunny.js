/**
 * Bunny
 */
'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Bunny;

function Bunny(x, y, gx, gy){
  base.call(this, gx, gy);

  // gx, gy are the grid positions in the map;
  // x and y are the pixel positions of the sprite.
	this.position = {x: x, y: y};
  this.gridPosition = {x: gx, y: gy};
}
util.inherits(Bunny, base);

exports.prototype.image = {
	type: 'image',
	path: 'bunny.png',
	anchor: {x: 0.5, y: 0.5}
};

exports.prototype.update = function(){

};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
