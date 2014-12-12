/**
 * ##Map 
 * Represents a grid of tiles
 */
'use strict';

var tileTypes = require('./tile_types');

var exports = module.exports = Map;

/**
 * Constructor for map class
 * @param {int}
 * @param {int}
 * @param {Function} f(x,y) returns tile
 */
function Map(width, height, tileGeneratorFunc){
	if(!tileGeneratorFunc){
		// If no generator provided, default to random
		tileGeneratorFunc = randomMapGenerator;
	}
	var map = Object.create(Map.prototype);
	map.width = width;
	map.height = height;
	var grid = map.grid = [];
	for (var j = 0; j < height; j++) {
		grid[j] = [];
		for (var i = 0; i < width; i++) {
			grid[j][i] = {
				tileType: tileTypes[0]
			};
		}
	}

	map.eachTile(tileGeneratorFunc);

	return map;
}

/**
 * Iterates over each tile of the grid
 * @param  {Function} func (tile, x, y, map)
 */
exports.prototype.eachTile = function(func){
	var self = this;
	this.grid.forEach(function(row, j){
		row.forEach(function(tile, i){
			func(tile, i, j, self);
		});
	});
};

/**
 * Generates tiles randomly with wall on edges
 * @return {tileType}
 */
function randomMapGenerator(tile, i, j, map){
	if(i === 0 || j === 0 || i === map.width - 1 || j === map.height - 1){
		tile.tileType = tileTypes[1];
	} else {
		tile.tileType = tileTypes[Math.floor(Math.random() * tileTypes.length)];		
	}
};