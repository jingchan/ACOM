/**
 * ## Scene
 * Represents full current game state
 */
'use strict';
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Scene;

function Scene(){
	var scene = Object.create(Scene.prototype);
	scene.entities = [];
	scene.maps = [];

	return scene;
}

util.inherits(Scene, EventEmitter);

exports.prototype.addEntity = function(entity){
	this.entities.push(entity);
	this.emit('entityAdded', entity);
	var self = this;
	entity.on('destroy', function(){
		self.emit('entityWillBeRemoved', entity);
		self.entities = _.reject(self.entities, function(el){ return el === entity; });
	});
};

exports.prototype.addMap = function(map){
	this.maps.push(map);
	this.emit('mapAdded', map);

	// map.on('destroy', function(){
	// 	this.emit('mapWillBeRemoved', map);
	// 	this.maps = _.reject(this.maps, function(el){ return el === map; });
	// });	
};

exports.prototype.update = function(){
	this.entities.forEach(function(entity){
		entity.update();
	});
};
