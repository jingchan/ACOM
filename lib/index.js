var PIXI = require('pixi.js');
var keypress = require('keypress').keypress;

var exports = module.exports = CreateApplication;

function CreateApplication(){
  var app = {

    // Setup intial state of app
    initialize: function(){
      // create an new instance of a pixi stage
      this.stage = new PIXI.Stage(0x66FF99,
                                  true);
      this.stage.projectiles = [];

      // create a renderer instance.
      this.renderer = PIXI.autoDetectRenderer(800, 600);

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

      // var target = new PIXI.Sprite(texture);
      // target.anchor.x = 0.5;
      // target.anchor.y = 0.5;
      // target.position.x = 400;
      // target.position.y = 350;
      // target.interactive = true;
      // this.tar = target;

      this.target = new PIXI.Sprite(texture);
      this.target.anchor.x = this.target.anchor.y = 0.5;
      this.target.position.x = 400;
      this.target.position.y = 350;
      this.target.interactive = true;
      var bunny = this.bunny;
      var tar = this.target;

      this.target.click = function() {
        document.getElementById('debug').innerHTML = 'Theres a click!';
      };

      this.stage.addChild(this.target);
      this.registerKeyboardHandlers();


    },

    // Return view to be added to DOM
    getView: function(){
      return this.renderer.view;
    },

    // Step forward one animation frame
    animateStep: function(){
      var ps = this.stage.projectiles;
      for (var i = 0; i < ps.length; i++){
        var bullet = ps[i];
        if (bullet.remaining_life < 0) {
          this.stage.removeChild(bullet);
          ps.splice(i, 1);
        } else {
          bullet.position.x += bullet.vx;
          bullet.position.y += bullet.vy;
          // just for fun, lets rotate mr rabbit a little
          bullet.rotation += 0.1;
          bullet.remaining_life -= 1;
        }
      }
      //Redraw stage
      this.renderer.render(this.stage);
    },

    // Setup keypress and add basic keyboard handlers
    registerKeyboardHandlers: function(){
      // register key listeners
      this.listener = new keypress.Listener();
      var bunny = this.bunny;
      var tar = this.target;
      var stage = this.stage;
      var ps = stage.projectiles;
      console.log(stage);
      console.log("whee");
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
      this.listener.simple_combo("h", function(){
        document.getElementById('debug').innerHTML = "WTF";
      });
      this.listener.simple_combo("l", function(){
        console.log(tar);
        var tx = tar.position.x;
        var ty = tar.position.y;
        document.getElementById('debug').innerHTML = 'projectiles: ' + ps.length + '   most recent:' + tx + ' ' + ty + '   bunny: ' + bunny.position.x + '  ' + bunny.position.y;
        var proj = new PIXI.Sprite(PIXI.Texture.fromImage("bunny.png")); // only spinning bunnies now
        proj.anchor.x = 0.5;
        proj.anchor.y = 0.5;
        proj.position.x = bunny.position.x;
        proj.position.y = bunny.position.y;
        proj.vx = (tx - bunny.position.x)/30;
        proj.vy = (ty - bunny.position.y)/30;
        proj.remaining_life = 30;
        ps.push(proj);
        stage.addChild(proj);
      });
    }
  };

  return app;
}
