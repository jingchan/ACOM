/**
 * ## RenderObject Base
 * - Base class for something that gets rendered
 * - Creates common interface between renderobjects that renderer can use
 * - Exposes visual object for rendering by renderer
 */

'use strict';

var exports = module.exports = RenderObject;

/**
 * Constructor for RenderObject
 * @param {Renderer} renderer
 */
function RenderObject(renderer){
	this.renderer = renderer;

	var game = this.renderer.game;
	this.display = game.add.group(null);
  this.dirty = true;
}

// Override this
// This is called for each renderobject prior to rendering
// 
// First check for dirtiness, then update phaser objects
exports.prototype.update = function(){};

exports.prototype.destroy = function(){
  this.display.destroy();
};
