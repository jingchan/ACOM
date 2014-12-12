/**
 * Creates game application
 */

'use strict';

var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var keypress = require('keypress').keypress;
  
module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){
      this.renderer = new Renderer;

      this.scene = new Scene();
      this.scene.map = new Map(10, 10);
      this.registerKeyboardHandlers();
    },

    // Return view to be added to DOM
    getView: function(){
      console.log(this, this.renderer);
      return this.renderer.getView();
    },

    // Step forward one animation frame
    animateStep: function(){
      // just for fun, lets rotate mr rabbit a little
      // this.bunny.rotation += 0.1;

      // Redraw stage
      // this.renderer.render(this.stage);

      // Draw Scene
      this.renderer.renderScene(this.scene);
    },

    // Setup keypress and add basic keyboard handlers
    registerKeyboardHandlers: function(){
      // register key listeners
      var bunny = this.bunny;
      this.listener = new keypress.Listener();

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
    }

  };

  return app;
}
