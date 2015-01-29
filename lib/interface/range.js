/**
 * ## Range
 *
 * the concept of a "range of attack" or "range of movement"
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Range;

var rangeCount = 0;

function Range(map){
  EventEmitter.call(this);

  this.map = map;
  this.name = "Range" + rangeCount.toString();
  this.grid = [];

  for (var j = 0; j < this.map.height; j++) {
   	this.grid[j] = [];
   	for (var i = 0; i < this.map.width; i++) {
   		this.grid[j][i] = false;
   	}
  }
}
util.inherits(Range, EventEmitter);

Range.prototype.setGrid = function(grid){
  this.grid = grid;
};