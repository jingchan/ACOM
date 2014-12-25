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

exports.prototype.update = function(){
};
