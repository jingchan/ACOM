/**
 * ## Basic RenderObject
 * Base class for something that gets rendered
 */

'use strict';
var PIXI = require('pixi.js');

var exports = module.exports = RenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function RenderObject(){
	this.renderer = null;
	this.display = new PIXI.DisplayObjectContainer();
}

exports.prototype.setVisible = function(visible) {
	this.display.visible = visible;
};

// Override this
exports.prototype.update = function(){  
};
