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
var MovementComponent = require('./movement');

var exports = module.exports = ActorComponent;

/**
 * Constructor for actor component
 *
 * Right now, we give the component a list of actions. However, this should
 * eventually be more dynamic (since the player can do stuff like gain more
 * actions by picking up an item or something.
 *
 * Example: actionss = [{name:'Move', event:'tryMove', data:{}},
 *                      {name:'Attack (r:5)', event:'tryAttack',
 *                         data:{damage:10,
 *                               range:9,
 *                               renderKey:'bunnyBullet'}},
 *                      {name:'Do Nothing', event:'doNothing', data:{}}];
 *
 */
function ActorComponent(actions, opts){
  Component.call(this, opts);

  this.actions = actions;
  this.menu = null;
}
util.inherits(ActorComponent, Component);

exports.prototype.name = 'actor';

exports.prototype.go = function(sceneManager, done){
  // TODO: Menu currently has too many deps on the app
  //       this is no longer to get makeMenu, but it is so
  //       we can talk to the renderer to make a menu object.
  Debug.log("Start Action", this.owner.name);
  var menu = this.menu || this.makeMenu(sceneManager.renderer);
  this.menu = menu;
  // TODO: Implement input handlers for each menu

  // Initialize cursor
  var cursor = new Cursor('menuCursor', this.owner.position.x, this.owner.position.y);
  cursor.addComponent(new Visual('cursor', {alpha:0.7, moveSpeed:10}));
  sceneManager.scene.addEntity(cursor);
  cursor.addComponent(new MovementComponent());

  var cursorListener = sceneManager.cursorListener;
  var menuListener = sceneManager.menuListener;
  var self = this; // the actor
  var inputMode = 'cursor';

  var listenerData = [{key:'a', x: -1, y: 0},
                      {key:'d', x: 1, y: 0},
                      {key:'w', x: 0, y: -1},
                      {key:'s', x: 0, y: 1}];

  listenerData.forEach(function(entry) {
    cursorListener.simple_combo(entry.key, function(){
      if(inputMode === 'cursor'){
        cursor.event('tryMove', {x1: cursor.position.x,
                              y1: cursor.position.y,
                              x2: entry.x + cursor.position.x,
                              y2: entry.y + cursor.position.y});
      }
    });
  });

  menuListener.simple_combo('w', function(){
    if (inputMode === 'menu'){
      menu.moveUp();
    }
  });
  menuListener.simple_combo('s', function(){
    if (inputMode === 'menu'){
      menu.moveDown();
    }
  });
  menuListener.simple_combo('space', function(){
    if (inputMode === 'menu'){
      // this means the menu is on right now, so the player just made
      // a selection
      menu.selectCurrent();
      menu.hide();
      menuListener.reset();
      done();
    }
    else {
      // this means we pressed space and we aren't already on the menu, so
      // we should show the menu but also reorient it to the cursor
      inputMode = 'menu';

      // tilePosition is important both for knowing where to
      // put the Menu, but also the associated data of movement.
      menu.tilePosition = {x:cursor.position.x,
                           y:cursor.position.y};
      cursorListener.reset();
      cursor.destroy();
      menu.show();
    }
  });


  Debug.log('Dispatched to Cursor/Menu input');
};

exports.prototype.makeMenu = function(renderer) {

  var menu = new Menu([], {type: 'hover_tile',
                           tilePosition: {x:0,
                                          y:0},
                           actor:this});
  var player = this.owner;

  var self = this;
  self.actions.forEach(function(action){
    var itemFunc = function(){
    // what information does the scene know? Just the information in the
    // action player picked, and also whatever the cursor returns.
      var data = {
        x1: player.position.x,
        y1: player.position.y,
        x2: menu.tilePosition.x,
        y2: menu.tilePosition.y
      };
      for (var attrname in action.data) {
        data[attrname] = action.data[attrname];
      }
      player.emit(action.event, data);
    };

    menu.addItem(new MenuItem(action.name, itemFunc));
  });

  var myMenu = new MenuRenderObject(renderer, menu);
  renderer.addRenderObject(myMenu);
  return menu;
};
