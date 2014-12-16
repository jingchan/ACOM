/**
 * Creates game application
 */

'use strict';

var Debug = require('./debug');

var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var SceneManager = require('./scene/sceneManager');

var Player = require('./entity/player');
var Bunny = require('./entity/bunny');
var Bullet = require('./entity/bullet');
var Cursor = require('./entity/cursor');

var MenuItem = require('./interface/menuItem');
var Menu = require('./interface/menu');
var MenuRenderObject = require('./renderer/menuRenderObject');

var KeyboardControllerComponent = require('./component/keyboardController');
var keypress = require('keypress').keypress;
var MovementComponent = require('./component/movement');
var Actor = require('./component/actor');

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
      this.player.addComponent(new Actor(this, this.scene));

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

      var sceneManager = this.sceneManager = new SceneManager(this.scene);

      var count = 10;
      var fn = function(){
        sceneManager.allActorsGo(function(){
          Debug.log('finished');

          // temp: prevent infinite locking loop
          count--;
          if(count>0)
            fn();
        });
      };

      fn();
      
    },

    // fire up a menu and return it
    // should probably move elsewhere later.
    makeMenu: function(player, cursorPos) {
      var menuItems = [];
      menuItems.push(new MenuItem('Move', function(){
        var data = {
          delta: false,
          x: cursorPos.x,
          y: cursorPos.y
        };
        Debug.log('Command Chosen', 'move');
        Debug.log('data', JSON.stringify(data));
        player.emit('move', data);
      }));
      menuItems.push(new MenuItem('Shoot', function(){
        Debug.log('Command Chosen', 'shoot');
        var bullet = new Bullet(player.position, cursorPos, 0, 60);
        player.scene.addEntity(bullet);
      }));
      menuItems.push(new MenuItem('Auto Shot', function(){
        Debug.log('Command Chosen', 'tripleShot');
        var bullet = new Bullet(player.position, cursorPos, 0, 45);
        player.scene.addEntity(bullet);
        var bullet2 = new Bullet(player.position, cursorPos, 15, 45);
        player.scene.addEntity(bullet2);
        var bullet3 = new Bullet(player.position, cursorPos, 30, 45);
        player.scene.addEntity(bullet3);
      }));
      menuItems.push(new MenuItem('Cancel', function(){
        Debug.log('Command Chosen', 'cancel');
      }));

      var menu = new Menu(menuItems, {
        type: 'hover_tile',
        tilePosition: [cursorPos.x, cursorPos.y]
      });

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
          self.menu.show();
        }
        else {
          if(self.menu.visible){
            self.menu.selectCurrent();
            self.menu.hide();
          } else {
            self.menu.tilePosition = [self.cursor.position.x, self.cursor.position.y];
            self.menu.show();
          }
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
