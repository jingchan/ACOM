/**
 * Creates game application
 */

'use strict';

var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var Bunny = require('./entities/bunny');
var BunnyBullet = require('./entities/bunny_bullet');

var keypress = require('keypress').keypress;
  
module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){
      this.scene = new Scene();
      this.renderer = new Renderer(this.scene);

      this.map = new Map(20, 15);
      this.scene.addMap(this.map);

      this.player = new Bunny(200, 150);
      this.scene.addEntity(this.player);

      this.target = new Bunny(400, 350);
      this.scene.addEntity(this.target);

      // this.target.click = function() {
      //   document.getElementById('debug').innerHTML = 'Theres a click!';
      // };

      this.registerKeyboardHandlers();
    },

    // Return view to be added to DOM
    getView: function(){
      console.log(this, this.renderer);
      return this.renderer.getView();
    },

    // Step forward one animation frame
    animateStep: function(){
      this.scene.update();
      // Draw Scene
      this.renderer.renderScene(this.scene);
    },

    // Setup keypress and add basic keyboard handlers
    registerKeyboardHandlers: function(){
      // register key listeners
      this.listener = new keypress.Listener();

      var self = this;

      var bunny = this.player;
      var tar = this.target;
      var stage = this.stage;
      // var ps = stage.projectiles;
      console.log(stage);
      console.log("whee");

      this.listener.simple_combo('a', function(){
        bunny.position.x -= 10;
      });
      this.listener.simple_combo('d', function(){
        bunny.position.x += 10;
      });
      this.listener.simple_combo('w', function(){
        bunny.position.y -= 10;
      });
      this.listener.simple_combo('s', function(){
        bunny.position.y += 10;
      });
      this.listener.simple_combo('h', function(){
        document.getElementById('debug').innerHTML = 'WTF';
      });
      this.listener.simple_combo('l', function(){
        var bullet = new BunnyBullet(self.player, self.target);
        self.scene.addEntity(bullet);
      });
    }
  };

  return app;
}
