/**
 * ## Actor Component
 * Implements ability for entity to act during scene cycle
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var Menu = require('../interface/menu');
var MenuItem = require('../interface/menuItem');
var MenuRenderObject = require('../renderer/menuRenderObject');

var Cursor = require('../entity/cursor');

var Visual = require('./visual');
var KeyboardControllerComponent = require('./keyboardController');
var MovementComponent = require('./movement');

var exports = module.exports = ActorComponent;

/**
 * Constructor for movement component
 * Temorarily take in the app to access makemenu
 */
function ActorComponent(app, scene, opts){
  Component.call(this, opts);

  this.scene = scene;
  this.app = app;
  this.menu = null;
}
util.inherits(ActorComponent, Component);

exports.prototype.name = 'actor';

exports.prototype.go = function(done){
  // TODO: Menu currently has too many deps on the app
  //       this is no longer to get makeMenu, but it is so
  //       we can talk to the renderer to make a menu object.
  Debug.log("Time to act", this.owner.name);
  var menu = this.menu || this.makeMenu();
  this.menu = menu;
  // TODO: Implement input handlers for each menu

  // Initialize cursor
  this.cursor = new Cursor('menuCursor', this.owner.position.x, this.owner.position.y);
  this.cursor.addComponent(new Visual(this.app.renderer, 'cursor', {}));
  this.scene.addEntity(this.cursor);
  this.cursor.addComponent(new KeyboardControllerComponent(this.app.cursorListener));
  this.cursor.addComponent(new MovementComponent());

  var listener = this.app.menuListener;
  var self = this; // the actor

  listener.simple_combo('w', function(){
    if (menu && menu.acceptingInput) {
      menu.moveUp();
    }
  });
  listener.simple_combo('s', function(){
    if (menu && menu.acceptingInput) {
      menu.moveDown();
    }
  });
  listener.simple_combo('space', function(){
    if (menu && menu.acceptingInput) {
      // this means the menu is on right now, so the player just made
      // a selection
      menu.selectCurrent();
      menu.hide();
      // give control back to the cursor
      self.cursor.getComponent("keyboardController").acceptingInput = true;
    }
    else {
      // this means we pressed space and we aren't already on the menu, so
      // we should show the menu but also reorient it to the cursor
      self.cursor.getComponent("keyboardController").acceptingInput = false;

      // tilePosition is important both for knowing where to
      // put the Menu, but also the associated data of movement.
      menu.tilePosition = {x:self.cursor.position.x,
                           y:self.cursor.position.y};
      menu.show();
    }
  });

  menu.on('selected', function(){
    Debug.log("Cursor/menu finished selection.");
    listener.reset();
    self.cursor.destroy();
    done();
  });


  Debug.log('Dispatched to Cursor/Menu input');
};

exports.prototype.makeMenu = function() {

  var menu = new Menu([], {type: 'hover_tile',
                           tilePosition: {x:0,
                                          y:0},
                           actor:this});
  var player = this.owner;

  menu.addItem(new MenuItem('Move', function(){
                                      var data = {
                                        delta: false,
                                        x: menu.tilePosition.x,
                                        y: menu.tilePosition.y
                                        };
                                      Debug.log('Command Chosen', 'move');
                                      Debug.log('data', JSON.stringify(data));
                                        player.emit('move', data);
                                    }));
  menu.addItem(new MenuItem('Cancel', function(){
                                        Debug.log('Command Chosen', 'cancel');
                                      }));

  var myMenu = new MenuRenderObject(this.app.renderer, menu);
  this.app.renderer.addRenderObject(myMenu);
  return menu;
}
