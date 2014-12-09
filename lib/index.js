var PIXI = require('pixi.js');
var keypress = require('keypress').keypress;
  
var exports = module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){
      // create an new instance of a pixi stage
      this.stage = new PIXI.Stage(0x66FF99);

      // create a renderer instance.
      this.renderer = PIXI.autoDetectRenderer(400, 300);

      // create a texture from an image path
      var texture = PIXI.Texture.fromImage("bunny.png");
      // create a new Sprite using the texture
      this.bunny = new PIXI.Sprite(texture);

      // center the sprites anchor point
      this.bunny.anchor.x = 0.5;
      this.bunny.anchor.y = 0.5;

      // move the sprite t the center of the screen
      this.bunny.position.x = 200;
      this.bunny.position.y = 150;

      this.stage.addChild(this.bunny);

      this.registerKeyboardHandlers();

    },

    // Return view to be added to DOM
    getView: function(){
      return this.renderer.view;
    },

    // Step forward one animation frame
    animateStep: function(){
      // just for fun, lets rotate mr rabbit a little
      this.bunny.rotation += 0.1;

      // Redraw stage
      this.renderer.render(this.stage);
    },

    // Setup keypress and add basic keyboard handlers
    registerKeyboardHandlers: function(){
      // register key listeners
      var bunny = this.bunny;
      this.listener = new keypress.Listener();

      this.listener.simple_combo("a", function(){
        bunny.position.x -= 10;
      });
      this.listener.simple_combo("d", function(){
        bunny.position.x += 10;
      });
      this.listener.simple_combo("w", function(){
        bunny.position.y -= 10;
      });
      this.listener.simple_combo("s", function(){
        bunny.position.y += 10;
      });
    }

  }

  return app;
}