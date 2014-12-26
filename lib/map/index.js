/**
 * ##Map
 * Represents a grid of tiles
 */

'use strict';

var tileTypes = require('./tileTypes');

var EventEmitter = require('events').EventEmitter;
var Math = require('mathjs');
var util = require('util');

var exports = module.exports = Map;

/**
 * Constructor for map class
 * @param {int}
 * @param {int}
 * @param {Function} f(x,y) returns tile
 *
 * REMINDER: grid[y][x] corresponds to (x, y);
 */
function Map(width, height, tileGeneratorFunc){
	if(!tileGeneratorFunc){
		// If no generator provided, default to random
		tileGeneratorFunc = randomMapGenerator;
	}
	EventEmitter.call(this);

	this.width = width;
	this.height = height;
	var grid = this.grid = [];
	for (var j = 0; j < height; j++) {
		grid[j] = [];
		for (var i = 0; i < width; i++) {
			grid[j][i] = {
				tileType: tileTypes[0]
			};
		}
	}

	this.eachTile(tileGeneratorFunc);
}
util.inherits(Map, EventEmitter);


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
 * Returns tile at a specific position
 * @param  {int} x x position
 * @param  {int} y y position
 * @return {Tile}   Tile at position (x, y)
 */
exports.prototype.tileAt = function(x, y){
  try {
		return this.grid[y][x];
  }
  catch (err) {
    return null;
  }
};

/**
 * Generates tiles randomly with wall on edges
 * @return {tileType}
 */
function randomMapGenerator(tile, i, j, map){
	if(i === 0 || j === 0 || i === map.width - 1 || j === map.height - 1){
		tile.tileType = tileTypes[1];
	} else {
		var rand = Math.random();
		if(rand < .7){
			tile.tileType = tileTypes[0];
		} else if (rand < .8){
			tile.tileType = tileTypes[1];
		} else {
			tile.tileType = tileTypes[2];
		}
	}
}

/**
 * Returns (as array) a digital line.
 *
 * (x1, y1) are the coordinates of the left and top of the start
 * box and (x2, y2) are the coordinates of the end box, so need
 * to change around for the other directions.
 *
 * Fairly straight Bresenham's Algorithm, mostly from here:
 * http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
 *
 * Ex: return Sight.digitalLine(3,4,5,5)
 *   should give [[3,4], [4,4], [4,5], [5,5]]
 *
 * exitFunc is called on each tile; if exitFunc returns True, then
 * we return (used for visibility testing, for example)
 *
 * we will always exit prematurely if we return a tile outside of
 * our map, which is exposed to digitalLine.
 */
exports.prototype.digitalLine = function(x1, y1, x2, y2, exitFunc) {
  var coordinatesArray = new Array();
  // Define differences and error check
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  // Set first coordinates
  coordinatesArray.push([x1, y1]);
  // Main loop
  while (!((x1 == x2) && (y1 == y2))) {
    var e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }

    if ((x1 < 0) || (x1 >= this.width) ||
        (y1 < 0) || (y1 >= this.height)) {
      break;
    } else if (exitFunc(x1, y1)) {
      break;
    }

    // Set coordinates
    coordinatesArray.push([x1,y1]);
  }
  // Return the result
  return coordinatesArray;
};

exports.prototype.visibleLine = function(x1, y1, x2, y2) {
  var self = this;
  return this.digitalLine(x1, y1, x2, y2,
                          function(x, y) {
                            return self.grid[y][x].tileType.options.blocksSight;
                          });
};