/**
 * Player
 */
'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Player;

function Player(x, y, gx, gy){
  base.call(this, gx, gy);

  // gx, gy are the grid positions in the map;
  // x and y are the pixel positions of the sprite.
	this.position = {x: x, y: y};
	this.gridPosition = {x: gx, y: gy};
}

util.inherits(Player, base);

exports.prototype.image = {
  type: 'image',
  path: 'monkey.png',
  anchor: {x: 0.5, y: 0.5}
};

exports.prototype.update = function(){
};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
