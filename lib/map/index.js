/**
 * ##Map 
 * Represents a grid of tiles
 */
'use strict';

var tileTypes = require('./tile_types');

module.exports = CreateMap;

/**
 * Constructor for map class
 * @param {int}
 * @param {int}
 * @param {Function} f(x,y) returns tile
 */
function CreateMap(width, height, tileGeneratorFunc){
	if(!tileGeneratorFunc){
		// If no generator provided, default to random
		tileGeneratorFunc = randomMapGenerator;
	}

	var map = [];
	for (var j = 0; j < height; j++) {
		map[j] = [];
		for (var i = 0; i < width; i++) {
			map[j][i] = {
				tileType: tileGeneratorFunc(i, j)
			};
		}
	}

	return map;
}

/**
 * Generates tiles randomly
 * @return {tileType}
 */
function randomMapGenerator(){
	return tileTypes[Math.floor(Math.random() * tileTypes.length)];
}
