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

  var menu = this.menu || this.makeMenu();
  this.menu = menu;
  // TODO: Implement input handlers for each menu

  menu.on('selected', function(){
    done();
  });


  Debug.log('Action finished');
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
