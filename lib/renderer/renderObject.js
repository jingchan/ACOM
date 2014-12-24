/**
 * ## Basic RenderObject
 * Base class for something that gets rendered
 * - Exposes visual object for rendering by renderer
 */

'use strict';

//var PIXI = require('pixi.js');

var exports = module.exports = RenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function RenderObject(renderer, name){
  this.name = name;
	this.renderer = renderer;
  this.shouldRender = false;
}


// Override this
exports.prototype.update = function(){
};
