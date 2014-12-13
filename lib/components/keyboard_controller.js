/**
 * Responds to keyboard input
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = KeyboardControllerComponent;

/**
 * Constructor for keyboard input
 * @param {Listener} listener Keypress Listener
 */
function KeyboardControllerComponent(listener){
  EventEmitter.call(this);

  this.listener = listener;
  this.acceptingInput = true;

  _listenToInputs.call(this);
}

util.inherits(KeyboardControllerComponent, EventEmitter);

/**
 * Sets entity to be controlled
 * @param  {Entity} entity owner of this component
 * @return {[type]}        [description]
 */
exports.prototype.registerOwner = function(entity){
  // TODO: properly unregister any existing owners
  this.owner = entity;
};

function _listenToInputs(){
  var self = this;

  this.listener.simple_combo('a', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {x: -1, y: 0});
    }
  });
  this.listener.simple_combo('d', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {x: 1, y: 0});
    }
  });
  this.listener.simple_combo('w', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {x: 0, y: -1});
    }
  });
  this.listener.simple_combo('s', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {x: 0, y: 1});
    }
  });
}
