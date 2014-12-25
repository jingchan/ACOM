/**
 * ## Health Component
 * Entities with this component has health (and also potentially health-related
 * status effects, such as burning, poison, etc.). The question to ask is
 *
 * "can I damage it?"
 *
 * As life is the possibility of death, health is the possibility of damage.
 *
 * Should include:
 * - all agents
 * - breakable walls
 * - damageable items/bombs/etc.
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var exports = module.exports = HealthComponent;

/**
 * Constructor
 */
function HealthComponent(health, opts){
  Component.call(this, opts);

  this.health = health;
  this.tryDamageHandler = _tryDamageHandler.bind(this);
}
util.inherits(HealthComponent, Component);

exports.prototype.name = 'healthComponent';


/**
 * I envision that suppose a bomb goes off, then it shoots "tryDamage" to all the
 * entities in a certain radius that has a HealthComponent, and those things
 * resolve what to do with the kind of damage.
 */
exports.prototype.registerOwner = function(entity){
  if(entity){
    entity.on('tryDamage', this.tryDamageHandler);
  }
};
exports.prototype.unregisterOwner = function(entity){
  if(entity){
    entity.removeListener('tryDamage', this.tryDamageHandler);
  }
};

/**
 * Catches events involving damage/status effects
 *
 * Example: blah.event('tryDamage', {damage:40, fire:true, armorpiercing:true});
 *
 * Like 'tryMove' vs 'move', I think it is important to have 2 different messages,
 * one for damage being emitted (like a bomb going off) and one for damage being
 * dealt (like my dude in anti-bomb armor shrugging off the bomb)
 *
 * Another difference is, say, renderer doesn't care about tryDamage, just damage.
 */
function _tryDamageHandler(args){
  var owner = this.owner;

  var oldHealth = this.health;
  var newHealth = this.health - args.damage; // no shrugging right now :D

  this.health = newHealth;

  this.emit('change', this);

  // renderer needs to catch this
  owner.emit("damage", {oldHealth:oldHealth, damage:args.damage});

  if(newHealth <= 0){
    owner.emit("destroy", null);
    // scene needs to catch this, in case there is some
    // resurrection shit and stuff
  }

  return false;
}
