/**
 * Entity base object
 */

'use strict';
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Entity;

function Entity(x, y){
  if(!x){
    x = 0;
  }
  if(!y){
    y = 0;
  }
  EventEmitter.call(this);

  this.position = {x: x, y: y};
  this.components = [];
  this.scene = null;
}
util.inherits(Entity, EventEmitter);

exports.prototype.event = function(eventName, eventArgs){
  this.emit(eventName, eventArgs);
};

exports.prototype.addComponent = function(component){
  component.registerOwner(this);

  this.components.push(component);

};
