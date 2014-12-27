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

/**
 * Constructor
 */
function SensoryComponent(sightRange, opts){
  Component.call(this, opts);

  this.sightRange = sightRange;
}
util.inherits(SensoryComponent, Component);

exports.prototype.name = 'sensory';


exports.prototype.registerOwner = function(entity){
};
exports.prototype.unregisterOwner = function(entity){
};
