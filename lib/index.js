/**
 * Creates game application
 */

'use strict';

var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var Player = require('./entities/player');
var Bunny = require('./entities/bunny');
var Bullet = require('./entities/bullet');

var keypress = require('keypress').keypress;

module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){
      this.scene = new Scene();
      this.renderer = new Renderer(this.scene);

      this.map = new Map(20, 14);
      this.scene.addMap(this.map);

      this.player = new Player(60, 60, 1, 1);
      this.scene.addEntity(this.player);

      this.target = new Bunny(400, 350, 10, 8);
      this.scene.addEntity(this.target);

      // if we take input
      this.accepting_input = true;

      // this.target.click = function() {
      //   document.getElementById('debug').innerHTML = 'Theres a click!';
      // };

      this.registerKeyboardHandlers();
    },

    // Return view to be added to DOM
    getView: function(){
      return this.renderer.getView();
    },

    // Step forward one animation frame
    animateStep: function(){
      // Update state of the game
      this.scene.update();

      // Draw Scene
      this.renderer.renderScene(this.scene);
    },

    // Setup keypress and add basic keyboard handlers

    registerKeyboardHandlers: function(){
      // register key listeners
      this.listener = new keypress.Listener();

      var self = this;
      var player = this.player;
      var map = this.map;

      this.listener.simple_combo('a', function(){
        if (self.accepting_input) {
          player.try_walk(player, map, -1, 0);
        };
      });
      this.listener.simple_combo('d', function(){
        if (self.accepting_input) {
          player.try_walk(player, map, 1, 0);
        };
      });
      this.listener.simple_combo('w', function(){
        if (self.accepting_input) {
          player.try_walk(player, map, 0, -1);
        };
      });
      this.listener.simple_combo('s', function(){
        if (self.accepting_input) {
          player.try_walk(player, map, 0, 1);
        };
      });
      this.listener.simple_combo('h', function(){
        document.getElementById('debug').innerHTML = 'WTF';
      });
      this.listener.simple_combo('space', function(){
        var bullet = new Bullet(self.player.position, self.target.position, 30);
        self.scene.addEntity(bullet);
      });
    }
  };

  return app;
}
