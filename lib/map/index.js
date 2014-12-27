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
 * Returns (as array) a digital line, drawn between a starting
 * and an ending point, with an optional stopping function.
 *
 * @param  {int} x x position
 * @param  {int} y y position
 *
 * @param {number} x1 - left coord of start box
 * @param {number} y1 - top coord of start box
 * @param {number} x2 - left coord of end box
 * @param {number} y2 - top coord of end box
 *
 * @return {Array} digital line, represented as an
 *   array of points [x,y].
 *
 * exitFunc is called on each tile; if exitFunc returns True, then
 * we return (used for visibility testing, for example)
 *
 * We will always exit prematurely if we return a tile outside of
 * our map, which is exposed to digitalLine.
 *
 * Implementation:
 *   fairly straight Bresenham's Algorithm, mostly from here:
 *   http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
 *
 * Ex: return Sight.digitalLine(3,4,5,5)
 *   should give [[3,4], [4,4], [4,5], [5,5]]
 *
 */
exports.prototype._digitalLine = function(x1, y1, x2, y2, exitFunc) {
  var coordinatesArray = [];
  // Define differences and error check
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  // Set first coordinates
  coordinatesArray.push([x1, y1]);
  // Main loop
  while (!((x1 === x2) && (y1 === y2))) {
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
    coordinatesArray.push([x1, y1]);
  }
  // Return the result
  return coordinatesArray;
};

exports.prototype.visibleLine = function(x1, y1, x2, y2) {
  var self = this;
  return this._digitalLine(x1, y1, x2, y2,
                          function(x, y) {
                            return self.grid[y][x].tileType.options.blocksSight;
                          });
};

/**
 * Returns visible tiles centered at (x,y) with range {range}.
 * format: a grid, so accessing point (x,y) is visibleGrid[y][x].
 *   X_X
 */
exports.prototype.visibleTiles = function(x, y, range) {
  //first find a rectangle with the L1 norm of the range
  var deltas = [{x:1, y:0},
                {x:0, y:1},
                {x:-1, y:0},
                {x:0, y:-1}];
  var curx = x - range;
  var cury = y - range;
  var boundingCoords = [];
  for (var k=0; k < 4; k++) {
    for (var i = 0; i < 2*range; i++) {
      curx += deltas[k].x;
      cury += deltas[k].y;
      boundingCoords.push([curx, cury]);
    }
  }

  var visibleGrid = [];
  for (var j = 0; j < this.height; j++) {
   	visibleGrid[j] = [];
   	for (var i = 0; i < this.width; i++) {
   		visibleGrid[j][i] = false;
   	}
  }

  for (var bc=0; bc < 8*range; bc++) {
    var vl = this.visibleLine(x,y, boundingCoords[bc][0],
        boundingCoords[bc][1]);
    for (var l = 0; l < vl.length; l++) {
      // TODO: if distance too far, break
      //if (this.distance(vl[l][1], vl[l][0], x, y) > range) {
      //  break;
      //}
      visibleGrid[vl[l][1]][vl[l][0]] = true;
    };
  }
  return visibleGrid;
};

exports.prototype.distance = function(x1, y1, x2, y2) {
  var xdist = x2-x1;
  var ydist = y2-y1;
  return Math.sqrt(xdist*xdist + ydist*ydist);
};
