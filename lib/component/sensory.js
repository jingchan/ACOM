/**
 * ## Sensory Component
 *
 * Entities with this component has different sources of sensory
 * input.
 *
 * The question to ask is "can it react to stimuli?"
 *
 * Should include:
 * - sight (the only important one right now, others would be nice later)
 * - hearing
 * - smell
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var exports = module.exports = SensoryComponent;
var _ = require('underscore');

/**
 * Constructor
 */
function SensoryComponent(opts){
  if(typeof opts === 'undefined') opts = {};
  Component.call(this, opts);
  this.sightRange = _.extend({sightRange:5}, opts).sightRange;

  this.visibilityMask = null;

  this.visibilityHandler = _visibilityHandler.bind(this);
  this.endTurnHandler = _endTurnHandler.bind(this);

}

util.inherits(SensoryComponent, Component);
exports.prototype.name = 'sensory';


exports.prototype.registerOwner = function(entity){
  if (entity) {
    // TODO: realistically speaking, this
    entity.on('startTurn', this.visibilityHandler);
    entity.on('endTurn', this.endTurnHandler);

  }
};
exports.prototype.unregisterOwner = function(entity){
  if (entity) {
    entity.removeListener('startTurn', this.visibilityHandler);
    entity.removeListener('endTurn', this.endTurnHandler);
  }
};

function _visibilityHandler(args) {
  var owner = this.owner;
  var map = this.owner.scene.map;

  this.visibilityMask = map.visibleTiles(
    owner.position.x,
    owner.position.y,
    this.sightRange);

  // the renderobject needs to catch this message, which roughly
  // means that the game is now taking the perspective of this
  // agent (so the renderer should know to render what's just
  // visible to this agent to its sensory input. When caught, the
  // renderer can, say, decide based on if the agent is on the
  // player's team or not to actually render the POV.
  this.emit('takingSensoryPOV', null);
}

function _endTurnHandler(args) {
  this.emit('removingSensoryPOV', null);
}