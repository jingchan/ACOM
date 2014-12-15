/**
 * Player
 */
'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Player;

function Player(x, y){
	base.call(this, x, y);

	this.position = {x: 40*x, y: 40*y};
	this.gridPosition = {x: x, y: y};
}

util.inherits(Player, base);

exports.prototype.image = {
  type: 'image',
  path: 'monkey.png',
  anchor: {x: 0, y: 0}
};

exports.prototype.update = function(){
};

//exports.prototype.try_walk = function(player, map, gx, gy){
  // try to walk in the given direction. Only calls if we are
  // accepting input!

//  var newx = player.grid_position.x + gx;
//  var newy = player.grid_position.y + gy;
//  if (!(newx < 0 || newx >= map.width || newy < 0 || newy >= map.height)) {
//    player.grid_position.x = newx;
//    player.grid_position.y = newy;
//    player.position.x += gx * 40;
//    player.position.y += gy * 40;

//    document.getElementById('debug2').innerHTML = '<b>Player position:</b> '
//    	                                       + JSON.stringify(player.grid_position);
//  };
//};


exports.prototype.destroy = function(){
	this.emit('destroy');
};
