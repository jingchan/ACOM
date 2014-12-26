/**
 * ## Health RenderObject
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');

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
    
    // this._drawHealthNumber();
    this._drawHealthBar();
  }
};

exports.prototype._drawHealthNumber = function (){
  var game = this.renderer.game;
  this.healthText = game.add.text(
    0, 
    0, 
    this.health.hp + '/' + this.health.maxhp,
    {font: '10px Arial', fill: '#ffffff'},
    this.display
  );

  this.healthText.position.x = this.renderer.tileSize / 2 - this.healthText.width;
  this.healthText.position.y = this.renderer.tileSize / 2 - this.healthText.height;
};

exports.prototype._drawHealthBar = function (){
  var game = this.renderer.game;
  var tileSize = this.renderer.tileSize;

  this.healthBar = game.add.group(this.display);

  var totalBar = game.add.graphics(0, 0, this.healthBar);
  totalBar.lineStyle(1, 0xffffff, 1);
  totalBar.beginFill(0xff0000, 1);
  totalBar.drawRect(-tileSize / 2, -2, tileSize / 2, 4);
  
  var hpRatio = this.health.hp / this.health.maxhp;
  var remainingBar = game.add.graphics(0, 0, this.healthBar); 
  remainingBar.lineStyle(1, 0xffffff, 1);
  remainingBar.beginFill(0x0000ff, 1);
  remainingBar.drawRect(
    -tileSize / 2 + tileSize * (1 - hpRatio), 
    -2, 
    tileSize * hpRatio, 
    4
  );

  this.healthBar.position.y = -tileSize / 2;
};
