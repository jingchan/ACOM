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

var keypress = require('keypress').keypress;

function SceneManager(scene, renderer){
  this.scene = scene;
  this.currentActor = null;
  this.renderer = renderer;

  this.menuListener = new keypress.Listener();
  this.cursorListener = new keypress.Listener();

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

  var self = this;

  var nextActorGo = function(actors, done){
    if(actors.length > 0){
      self.currentActor = actors[0];
      self.renderer.handleVisibleRange(self.currentActor);
      actors[0].go(self, function(){
        actors.splice(0, 1);
        nextActorGo(actors, done);
      });
    } else {
      done();
    }
  };

  nextActorGo(actorQueue, done);
};
