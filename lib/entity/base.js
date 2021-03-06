/**
 * ## Entity base object
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Entity;

function Entity(name, x, y){
  if(!x){
    x = 0;
  }
  if(!y){
    y = 0;
  }
  EventEmitter.call(this);

  this.name = name;
  this.position = {x: x, y: y};
  this.components = [];
  this.scene = null;
}
util.inherits(Entity, EventEmitter);

/**
 * Describes the visual representation of the object
 * @type {ImageDesc}
 */
exports.prototype.image = null;

exports.prototype.event = function(eventName, eventArgs){
  this.emit(eventName, eventArgs);
};

exports.prototype.addComponent = function(component){
  component.setOwner(this);
  this.components.push(component);
};

exports.prototype.getComponent = function(componentName){
  for (var i = 0; i < this.components.length; i++) {
    if(this.components[i].name === componentName){
      return this.components[i];
    }
  }
  return null;
};

exports.prototype.hasComponent = function(componentName){
  return (typeof this.getComponent(componentName) !== 'undefined');
};

exports.prototype.destroy = function(){
  // we should emit first so the components know how to destroy themselves
	this.emit('destroy');
  for (var i = 0; i < this.components.length; i++) {
    this.components[i].unregisterOwner(this);
  }
  this.components = []; //I'm assuming now all components will be garbage collected
  this.removeAllListeners();
};
