/**
 * ## Basic RenderObject
 * Base class for something that gets rendered
 *
 * TODO: I guess you mean in particular not entities?
 *
 * examples:
 * - menu object
 */

'use strict';

//var PIXI = require('pixi.js');

var exports = module.exports = RenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function RenderObject(renderer){
	this.renderer = renderer;
  this.shouldRender = false;
	// this.display = new PIXI.DisplayObjectContainer();
}


// Override this
exports.prototype.update = function(){
};
