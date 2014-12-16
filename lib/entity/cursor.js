/**
 * ## Cursor
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Cursor;

function Cursor(x, y){
	base.call(this, x, y);

	this.position = {x: x, y: y};
}
util.inherits(Cursor, base);

exports.prototype.image = {
	type: 'box',
	color: 0xff0000,
	alpha: 0.7
};

exports.prototype.update = function(){
};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
