/**
 * Bunny
 */
'use strict';

// var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Bunny;

function Bunny(x, y, gx, gy){
  // gx, gy are the grid positions in the map;
  // x and y are the pixel positions of the sprite.
	this.position = {x: x, y: y};
  this.grid_position = {x:gx, y:gy};
}
util.inherits(Bunny, EventEmitter);

exports.prototype.imagePath = 'bunny.png';
exports.prototype.anchor = {x: 0.5, y: 0.5};

exports.prototype.update = function(){

};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
