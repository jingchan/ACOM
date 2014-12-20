/**
 * Visual Component - adds visual element
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');
var _ = require('underscore');

var exports = module.exports = VisualComponent;

/**
 * Constructor for visual
 * @renderer
 * @spriteHandle a string that tells us what sprite to use. Right now this is
 *               the string that Phaser uses to index sprites
 */
function VisualComponent(renderer, spriteHandle, opts){
  Component.call(this, opts);

  this.game = renderer.game;

  // we use {group:true} if there could be multiple of these sprites onscreen
  // at once (which is actually most things; don't forget animations)
  if (!!opts.group) {
    this.sprite = this.game.loadedSprites[spriteHandle].getFirstDead();
  }
  else {
    this.sprite = this.game.loadedSprites[spriteHandle];
  }
  // give their "just stand there" animation
  if (!!opts.animated) {
    this.sprite.animations.add('default');
    this.sprite.animations.play('default', 4, true);
  }

  // for grid-y based things (like entities), we want the anchor to be on bottom
  // middle (feet).
  // TODO: may want to overwrite later for visual components for non grid-based
  //       things.
  this.sprite.anchor.setTo(0.5, 1);

  this.shouldRender = true;
}

util.inherits(VisualComponent, Component);

exports.prototype.name = 'visual';

// TODO: write destructor for sprite when we destroy this