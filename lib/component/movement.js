/**
 * ## Movement Component
 * Adds responders to the entity move events
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var Range = require('../interface/range');

var exports = module.exports = MovementComponent;
var _ = require('underscore');

/**
 * Constructor for movement component
 */
function MovementComponent(opts){
  Component.call(this, opts);

  if(typeof opts === 'undefined') opts = {};
  this.moveRange = _.extend({moveRange:5}, opts).moveRange;

  this.tryMoveHandler = _tryMoveHandler.bind(this);
  this.movabilityRange = new Range();
  this.startTurnHandler = _startTurnHandler.bind(this);
  this.endTurnHandler = _endTurnHandler.bind(this);
}

util.inherits(MovementComponent, Component);

exports.prototype.name = 'movement';

exports.prototype.registerOwner = function(entity){
  if(entity){
    entity.on('tryMove', this.tryMoveHandler);
    entity.on('startTurn', this.startTurnHandler);
    entity.on('endTurn', this.endTurnHandler);
  }
};
exports.prototype.unregisterOwner = function(entity){
  if(entity){
    entity.removeListener('tryMove', this.tryMoveHandler);
    entity.removeListener('startTurn', this.startTurnHandler);
    entity.removeListener('endTurn', this.endTurnHandler);
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

function _startTurnHandler(args) {
  var owner = this.owner;
  var map = this.owner.scene.map;
  this.movabilityRange.setGrid(map.movableTiles(
    owner.position.x,
    owner.position.y,
    this.moveRange));
  Debug.log("Movement Range changed");
  this.movabilityRange.emit('makingMoveRange', null);
}

function _endTurnHandler(args) {
  this.movabilityRange.emit('removingMoveRange', null);
}
