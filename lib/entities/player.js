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


exports.prototype.image = {
  type: 'image',
  path: 'monkey.png',
  anchor: {x: 0.5, y: 0.5}
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
