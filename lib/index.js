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

var KeyboardControllerComponent = require('./components/keyboard_controller');

var keypress = require('keypress').keypress;

module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){

      this.listener = new keypress.Listener();

      this.scene = new Scene();
      this.renderer = new Renderer(this.scene);

      this.map = new Map(20, 14);
      this.scene.addMap(this.map);

      this.player = new Player(60, 60, 1, 1);
      this.scene.addEntity(this.player);
      this.player.addComponent(new KeyboardControllerComponent(this.listener));


      this.target = new Bunny(400, 350, 10, 8);
      this.scene.addEntity(this.target);

      this._registerKeyboardHandlers();
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

    _registerKeyboardHandlers: function(){
      var self = this;

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
