/**
 * ##Sight
 *
 * LOS, raytracing, etc.
 */

'use strict';

var util = require('util');
var Math = require('mathjs');

var exports = module.exports = Sight;

/**
 * Exported class
 *
 * ASSUMPTION: map is immutable, so we can precompute a lot of
 *   things based on the map. (not using this assumption yet,
 *   but in the future may wish to memoize)
 *
 */
function Sight(map){
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
 */
exports.prototype.digitalLine = function(x1, y1, x2, y2) {
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
    // Set coordinates
    coordinatesArray.push([x1,y1]);
  }
  // Return the result
  return coordinatesArray;
};