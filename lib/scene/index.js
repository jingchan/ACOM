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

/**
 * Adds an new Entity for the Scene to manage
 * @param {Entity} entity Entity to be added
 */
exports.prototype.addEntity = function(entity){
	entity.scene = this;
	this.entities.push(entity);
	this.emit('entityAdded', entity);
	var self = this;
	entity.on('destroy', function(){
		self.emit('entityWillBeRemoved', entity);
		self.entities = _.reject(self.entities, function(el){ return el === entity; });
	});
};

/**
 * Adds a new Map for the Scene to manage
 * @param {Map} map Map to be added
 */
exports.prototype.addMap = function(map){
	this.maps.push(map);
	this.emit('mapAdded', map);

	// Map needs to inherit EventEmitter for this to work
	// map.on('destroy', function(){
	// 	this.emit('mapWillBeRemoved', map);
	// 	this.maps = _.reject(this.maps, function(el){ return el === map; });
	// });	
};

/**
 * Called for Scene to update all entities under its management
 */
exports.prototype.update = function(){
	this.entities.forEach(function(entity){
		entity.update();
	});
};
