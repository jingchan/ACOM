/**
 * ## Dragger
 * A quick-and-dirty wrapper of a grid-based entity that we define with an imagepath. Meant to be
 * more lightweight than player.js
 */

'use strict';

// var _ = require('underscore');
var base = require('./base');
var util = require('util');

var exports = module.exports = Dragger;

function Dragger(x, y, imagepath){
  base.call(this, x, y);
	this.position = {x: x, y: y};

  // it looks like this will be depreciated after Jing gets the visualComponent thing working.
  this.image = {
    type:'image',
    path:imagepath,
    anchor:{x:0.5, y:0.5}
  };
}
util.inherits(Dragger, base);


exports.prototype.update = function(){

};

exports.prototype.destroy = function(){
	this.emit('destroy');
};
