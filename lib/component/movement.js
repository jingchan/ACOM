/**
 * ## Movement Component
 * Adds responders to the entity move events
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var exports = module.exports = MovementComponent;

/**
 * Constructor for movement component
 */
function MovementComponent(opts){
  Component.call(this, opts);
  this.tryMoveHandler = _tryMoveHandler.bind(this);
}
util.inherits(MovementComponent, Component);

exports.prototype.name = 'movement';

exports.prototype.registerOwner = function(entity){
  if(entity){
    entity.on('tryMove', this.tryMoveHandler);
  }
};
exports.prototype.unregisterOwner = function(entity){
  if(entity){
    entity.removeListener('tryMove', this.tryMoveHandler);
  }
};

function _tryMoveHandler(args){
  // blah.event('move', {delta:false, x:1, y:3})
  // delta tells us if this is a shift or a teleport.

  var owner = this.owner;
  var map = this.owner.scene.map;

  var newx = args.x2;
  var newy = args.y2;

  // if (args.delta) {
  //  newx += owner.position.x;
  //  newy += owner.position.y;
  //}

  var tile = map.tileAt(newx, newy);
  if(tile){
    var canMove = false;
    if(!this.opts.collision){
      canMove = true;
    } else if (tile.tileType.getProperty('walkable')){
      canMove = true;
    } else if (this.opts.flying && !tile.tileType.getProperty('blocksProjectiles')){
      canMove = true;
    }

    if(canMove){

      owner.position.x = newx;
      owner.position.y = newy;
      owner.emit('changed', owner);

      owner.emit("successMove", args);
    }
  }

  return false;
}
