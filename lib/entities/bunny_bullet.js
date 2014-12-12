/**
 * Bullet that looks like a bunny
 */
'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = BunnyBullet;

function BunnyBullet(ownerEntity, targetEntity){
	this.position = _.clone(ownerEntity.position);
	this.rotation = 0;

	var tx = targetEntity.position.x;
    var ty = targetEntity.position.y;
    document.getElementById('debug').innerHTML = '<b>Most recent bullet:</b> '
    	+ ' bunny: ' + JSON.stringify(ownerEntity.position)
    	+ ' target: ' + JSON.stringify(targetEntity.position);
    this.vx = (tx - ownerEntity.position.x) / 30;
    this.vy = (ty - ownerEntity.position.y) / 30;

    this.remainingLife = 30;
}

util.inherits(BunnyBullet, EventEmitter);

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
