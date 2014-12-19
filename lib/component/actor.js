
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

  var menu = this.menu || this.makeMenu();
  this.menu = menu;
  // TODO: Implement input handlers for each menu
  // Keep hidden for now since no way to interact with and close menu
  // menu.show();

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
  // menuItems.push(new MenuItem('Shoot', function(){
  //   Debug.log('Command Chosen', 'shoot');
  //   var bullet = new Bullet(player.position, cursorPos, 0, 60);
  //   player.scene.addEntity(bullet);
  // }));
  // menuItems.push(new MenuItem('Auto Shot', function(){
  //   Debug.log('Command Chosen', 'tripleShot');
  //   var bullet = new Bullet(player.position, cursorPos, 0, 45);
  //   player.scene.addEntity(bullet);
  //   var bullet2 = new Bullet(player.position, cursorPos, 15, 45);
  //   player.scene.addEntity(bullet2);
  //   var bullet3 = new Bullet(player.position, cursorPos, 30, 45);
  //   player.scene.addEntity(bullet3);
  // }));
  menu.addItem(new MenuItem('Cancel', function(){
                                        Debug.log('Command Chosen', 'cancel');
                                      }));

  var myMenu = new MenuRenderObject(this.app.renderer, menu);
  this.app.renderer.addRenderObject(myMenu);
  return menu;
}
