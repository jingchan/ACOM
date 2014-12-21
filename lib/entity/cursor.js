/**
 * ## Cursor
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Cursor;

function Cursor(name, x, y){
	base.call(this, name, x, y);

	this.position = {x: x, y: y};
}
util.inherits(Cursor, base);

exports.prototype.image = {
	sprite: 'cursor',
	alpha: 0.7
};

exports.prototype.update = function(){
};
