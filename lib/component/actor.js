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
var MenuRenderObject = require('../renderer/renderObject/menuRenderObject');

var AI = require('../ai');
var Situation = require('../ai/situation');

var exports = module.exports = ActorComponent;



/**
 * Constructor for actor component
 *
 * Right now, we give the component a list of actions. However, this should
 * eventually be more dynamic (since the player can do stuff like gain more
 * actions by picking up an item or something.
 *
 * Example: actions = [{name:'Move', event:'tryMove', data:{}},
 *                     {name:'Attack (r:5)', event:'tryAttack',
 *                         data:{damage:10,
 *                               range:9,
 *                               renderKey:'bunnyBullet'}},
 *                      {name:'Do Nothing', event:'doNothing', data:{}}];
 *
 */
function ActorComponent(actions, opts){
  Component.call(this, opts);

  // TODO: make its own component
  this.AI = new AI(this, opts.AIType);
  this.actions = actions;
  this.menu = null;
}
util.inherits(ActorComponent, Component);

exports.prototype.name = 'actor';

exports.prototype.go = function(sceneManager, done){
  // TODO: Menu currently has too many deps on the app
  //       this is no longer to get makeMenu, but it is so
  //       we can talk to the renderer to make a menu object.
  var debugText = "Start " + this.AI.type + " Action";
  Debug.log(debugText, this.owner.name);
  this.owner.emit("startTurn", null);
  this.menu = this.menu || this.makeMenu(sceneManager.renderer);

  // TODO: Implement input handlers for each menu

  var situation = new Situation(sceneManager, sceneManager.scene);
  this.AI.makeAction(situation, done);
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
