/**
 * ## Bullet that looks like a bunny
 */

'use strict';

var _ = require('underscore');

var base = require('./base');
var util = require('util');

var Debug = require('../debug');

var exports = module.exports = Bullet;

function Bullet(iPos, tPos, prepTime, life){
  // fires a bullet after waiting for prepTime cycles that lasts for life cycles,
  // going from iPos (pixel position) to tPos (pixel position)
  // (for animating things, it isn't clear that we always want the animations to be set on grid-based
  // positions, we may want thiso:
  //  - fire a bullet from a corner
  //  - animate a person flying (basically a bullet)
  //  - etc.
  base.call(this);

	this.position = _.clone(iPos);
	this.rotation = 0;

	var tx = tPos.x;
  var ty = tPos.y;

  Debug.log('Most recent bullet', 'bunny:' + JSON.stringify(iPos),
            'target: ' + JSON.stringify(tPos));

  this.vx = (tx - iPos.x) / life;
  this.vy = (ty - iPos.y) / life;

  this.prepTime = prepTime;
  this.remainingLife = life;
}
util.inherits(Bullet, base);

exports.prototype.update = function(){
  if(this.prepTime > 0) {
    this.prepTime -= 1;
  } else if (this.remainingLife <= 0){
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
