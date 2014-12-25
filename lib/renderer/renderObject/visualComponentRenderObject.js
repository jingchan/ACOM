/**
 * ## VisualComponent RenderObject
 * - Renders a visualComponent
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');
var PIXI = require('pixi.js');

var exports = module.exports = VisualComponentRenderObject;

/**
 * Constructor for VisualComponentRenderObject
 */
function VisualComponentRenderObject(renderer, visual){
  RenderObject.call(this, renderer);

  this.visual = visual;

  // Style parameters

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  // TODO: Listen to map for changes and updated accordingly
  // map.on('event', function(){
  // });
}
util.inherits(VisualComponentRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;

    if(this.visual.type === 'phaserSprite') {
      this._addPhaserSprite();
    } else if(this.visual.type === 'image') {
      this._addImageSprite();
    } else if (this.visual.type === 'box') {
      this._addBox();
    }
      
    if(this.visual.offset){
      this.display.position.x = this.visual.offset[0];
      this.display.position.y = this.visual.offset[1];
    }

    if(typeof this.visual.alpha !== 'undefined'){
      this.display.alpha = this.visual.alpha;
    }
  }
};

exports.prototype._addPhaserSprite = function (){
  var game = this.renderer.game;
  var owner = this.visual.owner;
  var visual = this.visual;

  var sprite = this.sprite = this.display.create(0, 0, visual.handle);

  // Add teamMarker
  if (typeof owner.team !== 'undefined') {
    // this is how you look up shit from the cache
    var cachedBitmap = game.cache.getBitmapData(owner.team);
    var teamMarker = this.display.create(-this.renderer.tileSize / 2, this.renderer.tileSize / 2, cachedBitmap);
    teamMarker.anchor.setTo(0.5, 0.5);
  }

  // give their "just stand there" animation
  if (visual.opts.animated) {
    sprite.animations.add('default');
    sprite.animations.play('default', 4, true);
  }

  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 0.5;
  if(typeof this.visual.anchor !== 'undefined'){
    this.sprite.anchor.x = this.visual.anchor[0];
    this.sprite.anchor.y = this.visual.anchor[1];
  }
};

exports.prototype._addImageSprite = function(){
  var game = this.renderer.game;
  var texture = PIXI.Texture.fromImage(this.visual.path);
  var sprite = this.sprite = game.add.sprite(0, 0, texture);

  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 0.5;
  if(typeof this.visual.anchor !== 'undefined'){
    this.sprite.anchor.x = this.visual.anchor[0];
    this.sprite.anchor.y = this.visual.anchor[1];
  }

  this.display.add(sprite);
};

exports.prototype._addBox = function(){
  var game = this.renderer.game;
  var tileSize = this.renderer.tileSize;

  // Account for anchor support
  var offset = [0, 0];
  if(typeof this.visual.anchor !== 'undefined'){
    offset[0] = -this.visual.anchor[0] * tileSize + tileSize / 2;
    offset[1] = -this.visual.anchor[1] * tileSize + tileSize / 2;
  }
  
  var box = game.add.graphics(0, 0);
  box.beginFill(this.visual.color, this.visual.alpha);
  box.drawRect(-tileSize / 2 + offset[0], -tileSize / 2 + offset[1], tileSize, tileSize);

  this.display.add(box);
};
