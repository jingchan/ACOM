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
  // blah.event('move', {delta:false, x:1, y:3})
  // delta tells us if this is a shift or a teleport.

  var owner = this.owner;
  var map = this.owner.scene.maps[0];

  var newx = args.x;
  var newy = args.y;

  if (args.delta) {
    newx += owner.gridPosition.x;
    newy += owner.gridPosition.y;
  }
  else {
  }

  var tile = map.tileAt(newx, newy);
  if(tile){
    if(!this.opts.collision || tile.tileType.getProperty('walkable')){
      // TODO: this walkability should be checked depending on mode of movement:
      // cursors (and flying creatures, say) have different walkability as people
      owner.gridPosition.x = newx;
      owner.gridPosition.y = newy;
      owner.position.x = newx * 40;
      owner.position.y = newy * 40;
      return true;
    }
  }
  Debug.log("unmovable tile!", JSON.stringify(args));
  return false;
}
