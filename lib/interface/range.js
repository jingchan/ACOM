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

function Range(rangeType){
  EventEmitter.call(this);

  this.rangeType = rangeType;
  this.name = this.rangeType + "Range" + rangeCount.toString();

  this.grid = null;

}
util.inherits(Range, EventEmitter);

Range.prototype.setGrid = function(grid){
  this.grid = grid;
};