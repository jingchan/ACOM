/**
 * ## VisualComponent RenderObject
 * - Renders a visualComponent
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');

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

    if(this.visual.type === 'phaserSprite')
    {
      this._addPhaserSprite();
    }
  }
};

exports.prototype._addPhaserSprite = function (){
  var game = this.renderer.game;
  var owner = this.visual.owner;
  var visual = this.visual;

  var displayPosition = this.renderer._tileToPosition(owner.position.x, owner.position.y);
  this.display.position = displayPosition;
  var sprite = this.sprite = this.display.create(0, 0, visual.handle);

  // Add teamMarker
  if (typeof owner.team !== 'undefined') {
    // this is how you look up shit from the cache
    var cachedBitmap = game.cache.getBitmapData(owner.team);
    var teamMarker = this.display.create(-this.renderer.tileSize / 2, 0, cachedBitmap);
    teamMarker.anchor.setTo(0.5, 0.5);
  }

  if (typeof visual.opts.alpha !== 'undefined') {
    sprite.alpha = visual.opts.alpha;
  }

  // give their "just stand there" animation
  if (visual.opts.animated) {
    sprite.animations.add('default');
    sprite.animations.play('default', 4, true);
  }

  // for grid-y based things (like entities), we want the anchor to be on bottom
  // middle (feet).
  sprite.anchor.setTo(0.5, 1);
};
