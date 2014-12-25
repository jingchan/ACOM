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

function Agent(name, team, x, y){
	base.call(this, name, x, y);

	this.position = {x: x, y: y};
  this.team = team;
}

util.inherits(Agent, base);


exports.prototype.update = function(){
};
