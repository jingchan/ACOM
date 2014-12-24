/**
 * ## Basic RenderObject
 * - Base class for something that gets rendered
 * - Creates common interface between renderobjects that renderer can use
 * - Exposes visual object for rendering by renderer
 */

'use strict';

//var PIXI = require('pixi.js');

var exports = module.exports = RenderObject;

/**
 * Constructor for RenderObject
 * @param {Scene} scene Scene to be rendered
 */
function RenderObject(renderer, name){
  this.name = name;
	this.renderer = renderer;
  this.shouldRender = false;

	var game = this.renderer.game;
	this.display = game.add.group(null);
  this.dirty = true;
}


// Override this
// This is called for each renderobject prior to rendering
// 
// First check for dirtiness, then update phaser objects
exports.prototype.update = function(){
};
