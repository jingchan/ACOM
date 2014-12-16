/**
 * Responds to keyboard input
 * Notes: This functionality probably should not be a component
 */

'use strict';

var Component = require('./base');
var util = require('util');

var exports = module.exports = KeyboardControllerComponent;

/**
 * Constructor for keyboard input
 * @param {Listener} listener Keypress Listener
 */
function KeyboardControllerComponent(listener, opts){
  Component.call(this, opts);

  this.listener = listener;
  this.acceptingInput = true;

  _listenToInputs.call(this);
}
util.inherits(KeyboardControllerComponent, Component);

exports.prototype.name = 'keyboardController';

function _listenToInputs(){
  var self = this;

  this.listener.simple_combo('a', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {delta:true, x: -1, y: 0});
    }
  });
  this.listener.simple_combo('d', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {delta:true, x: 1, y: 0});
    }
  });
  this.listener.simple_combo('w', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {delta:true, x: 0, y: -1});
    }
  });
  this.listener.simple_combo('s', function(){
    var owner = self.owner;
    if(self.acceptingInput && owner){
      owner.event('move', {delta:true, x: 0, y: 1});
    }
  });
}
