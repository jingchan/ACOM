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

      this.player = new Player(60, 60, 1, 1);
      this.scene.addEntity(this.player);
      // this.player.addComponent(new KeyboardControllerComponent(this.listener));
      this.player.addComponent(new MovementComponent({collision: true}));

      this.cursor = new Cursor(2, 2);
      this.scene.addEntity(this.cursor);
      this.cursor.addComponent(new KeyboardControllerComponent(this.listener));
      this.cursor.addComponent(new MovementComponent());

      this.target = new Bunny(400, 350, 10, 8);
      this.scene.addEntity(this.target);

      this.menu = new Menu(0, 360, 800, 200);
      this.menu.addItem(new MenuItem('Move', function(){
        Debug.log('Command Chosen', 'move');
      }));
      this.menu.addItem(new MenuItem('Act', function(){
        Debug.log('Command Chosen', 'act');
      }));
      this.menu.addItem(new MenuItem('Wait', function(){
        Debug.log('Command Chosen', 'wait');
      }));
      this.menu.addItem(new MenuItem('Status', function(){
        Debug.log('Command Chosen', 'status');
      }));
      this.renderer.addRenderObject(new MenuRenderObject(this.menu));

      var self = this;
      this.menu.on('selected', function(){
        self.menu.destroy();
        self.menu = null;
      });

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

      this.listener.simple_combo('up', function(){
        self.menu.moveUp();
      });
      this.listener.simple_combo('down', function(){
        self.menu.moveDown();
      });
      this.listener.simple_combo('enter', function(){
        self.menu.selectCurrent();
      });


    }
  };

  return app;
}
