/**
 * ## Scene
 * Represents full current game state
 */

'use strict';

var Debug = require('../debug');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Math = require('mathjs');

var Map = require('../map');

var exports = module.exports = Scene;

function Scene(){
	var scene = Object.create(Scene.prototype);
	scene.entities = [];
	scene.map = null;

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


  entity.on('tryAttack', function(data) {
    var dist = self.map.distance(data.x1, data.y1,
                                 data.x2, data.y2);
    if ( dist > data.range) {
      Debug.log("attack failed");
    } else {
      var opps = self.getEntitiesByTile(data.x2, data.y2);
      for (var i = 0; i < opps.length; i++) {
        // should have more knowledge. For now just do full damage

        // 2 events:
        // the entity should tell the world he/she was successful in attacking
        // the opponent should be damaged
        entity.emit('successAttack', data);
        opps[i].emit('tryDamage', data);
      }
      Debug.log("successfully attacked entity count", opps.length);
    }
  });

	entity.on('destroy', function(){
		self.emit('entityWillBeRemoved', entity);
		self.entities = _.reject(self.entities, function(el){ return el === entity; });
	});
};

exports.prototype.getEntitiesByTile = function(gx, gy){
  return this.entities.filter(function(entity) {
           return (entity.position.x === gx && entity.position.y === gy);
         });
};

exports.prototype.update = function(){
	this.entities.forEach(function(entity){
		entity.update();
	});
};

 /**
 * Adds a new Map for the Scene to manage
 * @param {Map} map Map to be added
 */
exports.prototype.addMap = function(map){
	this.map = map;
	this.emit('mapAdded', map);

	// Map needs to inherit EventEmitter for this to work
	// map.on('destroy', function(){
	// 	this.emit('mapWillBeRemoved', map);
	// 	this.maps = _.reject(this.maps, function(el){ return el === map; });
	// });
};
