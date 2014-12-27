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

  this.visibilityMask = [];
  for (var y = 0; y < this.map.height; y++) {
    this.visibilityMask.push([]);
    for (var x = 0; x < this.map.width; x++) {
      this.visibilityMask[y].push(true);
    }
  };


}

    scene.on('readyToGo', function(actor){
      var entity = actor.owner;
      var visibleTiles = scene.map.visibleTiles(
        entity.position.x,
        entity.position.y,
        actor.sightRange);
      mapRenderObject.applyVisibilityMask(visibleTiles);
    });


util.inherits(SensoryComponent, Component);
exports.prototype.name = 'sensory';


exports.prototype.registerOwner = function(entity){
};
exports.prototype.unregisterOwner = function(entity){
};
