/**
 * Movement Component - adds responders to the move event
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

  this.moveHandler = _moveHandler.bind(this);
}
util.inherits(MovementComponent, Component);


exports.prototype.registerOwner = function(entity){
  if(entity){
    entity.on('move', this.moveHandler);
  }
};
exports.prototype.unregisterOwner = function(entity){
  if(entity){
    entity.removeListener('move', this.moveHandler);
  }
};

function _moveHandler(args){
  var owner = this.owner;
  var map = this.owner.scene.maps[0];

  var newx = owner.gridPosition.x + args.x;
  var newy = owner.gridPosition.y + args.y;

  var tile = map.tileAt(newx, newy);
  if(tile){
    if(!this.opts.collision || tile.tileType.getProperty('walkable')){
      owner.gridPosition.x = newx;
      owner.gridPosition.y = newy;
      owner.position.x += args.x * 40;
      owner.position.y += args.y * 40;
    }
  }
}
