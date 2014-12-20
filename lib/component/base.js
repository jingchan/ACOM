/**
 * ## Base component object
 */

'use strict';

var exports = module.exports = Component;

/**
 * Constructor for component
 */
function Component(opts){
  opts = opts || {};

  this.opts = opts;
  this.owner = null;
}

// Should be overrided
exports.prototype.name = 'base';

/**
 * Sets entity to be controlled
 * @param  {Entity} entity owner of this component
 * @return {[type]}        [description]
 */
exports.prototype.setOwner = function(entity){
  this.unregisterOwner(this.owner);
  this.owner = entity;
  this.registerOwner(entity);
};

// To be overridden
exports.prototype.unregisterOwner = function(){};
exports.prototype.registerOwner = function(){};
