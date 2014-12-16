/**
 * ## Player
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Player;

function Player(x, y){
	base.call(this, x, y);

	this.position = {x: x, y: y};
}
util.inherits(Player, base);

exports.prototype.image = {
  type: 'image',
  path: 'monkey.png',
  anchor: {x: 0.5, y: 0.5}
};

exports.prototype.update = function(){
};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
