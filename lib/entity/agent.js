/**
 * ## Agent
 *
 * Agents are entities that act, such as PCs or enemy characters.
 *
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Agent;

function Agent(name, x, y){
	base.call(this, name, x, y);

	this.position = {x: x, y: y};

  this.image = {
    type: 'image',
    path: null,
    anchor: {x: 0.5, y: 0.5}
  };
}

util.inherits(Agent, base);


exports.prototype.update = function(){
};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
