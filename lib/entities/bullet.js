/**
 * Bullet that looks like a bunny
 */
'use strict';

var _ = require('underscore');

var base = require('./base');
var util = require('util');

var exports = module.exports = Bullet;

function Bullet(ownerPos, targetPos, life){
  base.call(this);

	this.position = _.clone(ownerPos);
	this.rotation = 0;

	var tx = targetPos.x;
  var ty = targetPos.y;
  document.getElementById('debug').innerHTML = '<b>Most recent bullet:</b> '
    	                                       + ' bunny: ' + JSON.stringify(ownerPos)
    	                                       + ' target: ' + JSON.stringify(targetPos);
  this.vx = (tx - ownerPos.x) / life;
  this.vy = (ty - ownerPos.y) / life;

  this.remainingLife = life;
}

util.inherits(Bullet, base);

exports.prototype.imagePath = 'bunny.png';
exports.prototype.anchor = {x: 0.5, y: 0.5};

exports.prototype.update = function(){
	if(this.remainingLife <= 0){
		this.destroy();
	} else {
		this.position.x += this.vx;
		this.position.y += this.vy;
		// just for fun, lets rotate mr rabbit a little
		this.rotation += 0.1;
		this.remainingLife -= 1;
	}
};


exports.prototype.destroy = function(){
	this.emit('destroy');
};
