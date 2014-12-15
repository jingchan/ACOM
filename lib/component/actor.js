/**
 * Actor Component - Entity can perform actions
 */
'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var exports = module.exports = ActorComponent;

/**
 * Constructor for movement component
 */
function ActorComponent(scene, opts){
  Component.call(this, opts);

  this.scene = scene;
}
util.inherits(ActorComponent, Component);

exports.prototype.name = 'actor';

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

exports.prototype.go = function(done){

}