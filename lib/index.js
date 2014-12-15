/**
 * Creates game application
 */

'use strict';

var Debug = require('./debug');

var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var Player = require('./entities/player');
var Bunny = require('./entities/bunny');
var Bullet = require('./entities/bullet');
var Cursor = require('./entities/cursor');

var MenuItem = require('./interface/menuItem');
var Menu = require('./interface/menu');
var MenuRenderObject = require('./renderer/menuRenderObject');

var KeyboardControllerComponent = require('./components/keyboardController');
var keypress = require('keypress').keypress;
var MovementComponent = require('./components/movement');

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

      // Create a sample player entity
      this.player = new Player(1, 1);
      this.scene.addEntity(this.player);
      // this.player.addComponent(new KeyboardControllerComponent(this.listener));
      this.player.addComponent(new MovementComponent({collision: true}));

      // Create a sample cursor
      this.cursor = new Cursor(2, 2);
      this.scene.addEntity(this.cursor);
      this.cursor.addComponent(new KeyboardControllerComponent(this.listener));
      this.cursor.addComponent(new MovementComponent());

      this.menu = null;

      // Clear the menu
      // var self = this;
      // this.menu.on('selected', function(){
      //   self.menu.destroy();
      //   self.menu = null;
      // });

      this._registerKeyboardHandlers();
    },

    // fire up a menu and return it
    // should probably move elsewhere later.
    makeMenu: function(player, cursorPos) {
      console.log(cursorPos);
      var menu = new Menu(cursorPos.x * 40, cursorPos.y * 40, {width: 200});
      var iPos = {};
      iPos.x = player.position.x * 40;
      iPos.y = player.position.y * 40;
      var cPos = {};
      cPos.x = cursorPos.x * 40;
      cPos.y = cursorPos.y * 40;
      menu.addItem(new MenuItem('Move', function(){
        var data = {
          delta: false,
          x: cursorPos.x,
          y: cursorPos.y
        };
        Debug.log('Command Chosen', 'move');
        Debug.log('data', JSON.stringify(data));
        player.emit('move', data);
      }));
      menu.addItem(new MenuItem('Shoot', function(){
        Debug.log('Command Chosen', 'shoot');
        var bullet = new Bullet(iPos, cPos, 0, 60);
        player.scene.addEntity(bullet);
      }));
      menu.addItem(new MenuItem('Auto Shot', function(){
        Debug.log('Command Chosen', 'tripleShot');
        var bullet = new Bullet(iPos, cPos, 0, 45);
        player.scene.addEntity(bullet);
        var bullet2 = new Bullet(iPos, cPos, 15, 45);
        player.scene.addEntity(bullet2);
        var bullet3 = new Bullet(iPos, cPos, 30, 45);
        player.scene.addEntity(bullet3);
      }));
      menu.addItem(new MenuItem('Cancel', function(){
        Debug.log('Command Chosen', 'cancel');
      }));
      this.renderer.addRenderObject(new MenuRenderObject(menu));
      return menu;
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

      this.listener.simple_combo('l', function(){
        Debug.log('entities', JSON.stringify(self.scene.entities.length));
        //        document.getElementById('debug').innerHTML = debugtext;
      });

      // TODO: this should be added dynamically with a menu
      this.listener.simple_combo('w', function(){
        if (self.menu) {
          self.menu.moveUp();
        }
      });
      this.listener.simple_combo('s', function(){
        if (self.menu) {
          self.menu.moveDown();
        }
      });
      this.listener.simple_combo('space', function(){
        if (!self.menu) {
        // var bullet = new Bullet(self.player.position, self.target.position, 30);
        // self.scene.addEntity(bullet);
          self.menu = self.makeMenu(self.player, self.cursor.position);
        }
        else if (self.menu) {
          self.menu.selectCurrent();
          self.menu.destroy();
          self.menu = null; // objects can't commit suicide, so you have to do this from outside.
        }
      });
      // this.listener.simple_combo('esc', function(){
      //   if (self.menu) {
      //     self.menu.destroy();
      //     delete self.menu;
      //   }
      // });



    }
  };

  return app;
}
