/**
 * ## Basic Scene Manager
 * Controls the flow of a scene
 */

'use strict';

var Debug = require('../debug');

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = SceneManager;

function SceneManager(scene){
  this.scene = scene;
  this.currentActor = null;

  this.actorQueue = [];
}
util.inherits(SceneManager, EventEmitter);

exports.prototype.allActorsGo = function(done){
  var actorQueue = [];
  
  this.scene.entities.forEach(function(e){
    var actor = e.getComponent('actor');
    if(actor){
      actorQueue.push(actor);
    }
  });

  var nextActorGo = function(actors, done){
    if(actors.length > 0){
      actors[0].go(function(){
        actors.splice(0, 1);
        nextActorGo(actors, done);
      });
    } else {
      done();
    }
  };

  nextActorGo(actorQueue, done);
};
