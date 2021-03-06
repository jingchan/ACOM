/**
 * Phaser Sprite Visual Component - adds visual element based on a Phaser SpriteHandle
 * - Usage requires existing preloaded sprite handles
 */

'use strict';

var Debug = require('../debug');

var VisualComponent = require('./visual');
var util = require('util');

var exports = module.exports = PhaserSpriteVisualComponent;

/**
 * Constructor for visual
 * @renderer
 * @handle a string that tells us what sprite to use. Right now this is
 *               the string that Phaser uses to index sprites
 */
function PhaserSpriteVisualComponent(handle, opts){
  opts = opts || {};
  VisualComponent.call(this, opts);

  this.handle = handle;


}
util.inherits(PhaserSpriteVisualComponent, VisualComponent);

exports.prototype.type = 'phaserSprite';
