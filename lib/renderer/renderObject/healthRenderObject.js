/**
 * ## Health RenderObject
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');
var PIXI = require('pixi.js');

var exports = module.exports = HealthRenderObject;

/**
 * Constructor for VisualComponentRenderObject
 */
function HealthRenderObject(renderer, health){
  RenderObject.call(this, renderer);

  this.health = health;

  // Style parameters

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  // TODO: Listen to map for changes and updated accordingly
  // map.on('event', function(){
  // });
  var that = this;
  health.on('change', function(){
    that.dirty = true;
  });
}
util.inherits(HealthRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;

    // TODO: Don't need to fully reconstruct every time
    this.display.removeAll();
    
    this._drawHealthNumber();      
  }
};

exports.prototype._drawHealthNumber = function (){
  var game = this.renderer.game;
  this.healthText = game.add.text(
    0, 
    0, 
    this.health.health,
    {font: '16px Arial', fill: '#ffffff'},
    this.display
  );

};

