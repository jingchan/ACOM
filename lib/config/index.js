'use strict';

var config = module.exports = {};

/**
 * Configure rendering engine
 * @type {String} phaser | pixi
 */
config.renderer = {
	engine: 'phaser',
	tileSize: 40,
	viewSize: [800, 680],
};
