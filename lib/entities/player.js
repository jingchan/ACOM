/**
 * Player
 */
'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var Debug = require('../debug');

var exports = module.exports = Player;

function Player(x, y, gx, gy){
  base.call(this, gx, gy);

  // gx, gy are the grid positions in the map;
  // x and y are the pixel positions of the sprite.
	this.position = {x: x, y: y};
  this.gridPosition = {x: gx, y: gy};

  // TODO: Walking should be its own component (since many things want to be able to move)
  // right now listen to self until walking is put into component
  var self = this;
  this.on('move', function(moveEventArgs){
    self.tryWalk(self.scene.maps, moveEventArgs.x, moveEventArgs.y);
  });
}

util.inherits(Player, base);

exports.prototype.imagePath = 'monkey.png';
exports.prototype.anchor = {x: 0.5, y: 0.5};

exports.prototype.update = function(){
};

exports.prototype.tryWalk = function(maps, gx, gy){
  // try to walk in the given direction. Only calls if we are
  // accepting input!
  var player = this;
  var map = maps[0];

  var newx = player.gridPosition.x + gx;
  var newy = player.gridPosition.y + gy;

  var tile = map.tileAt(newx, newy);
  if(tile){
    if(tile.tileType.getProperty('walkable')){
      player.gridPosition.x = newx;
      player.gridPosition.y = newy;
      player.position.x += gx * 40;
      player.position.y += gy * 40;
    }
  }

  Debug.log('Player position', JSON.stringify(player.gridPosition));

};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
