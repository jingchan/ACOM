/**
 * Actor Component - Entity can perform actions
 */

'use strict';

var Debug = require('../debug');

var Component = require('./base');
var util = require('util');

var Menu = require('../interface/menu');
var MenuItem = require('../interface/menuItem');

var exports = module.exports = ActorComponent;

/**
 * Constructor for movement component
 * Temorarily take in the app to access makemenu
 */
function ActorComponent(app, scene, opts){
  Component.call(this, opts);

  this.scene = scene;
  this.app = app;
}
util.inherits(ActorComponent, Component);

exports.prototype.name = 'actor';

exports.prototype.go = function(done){
    // TODO: Menu currently has too many deps on the app
    var menu = this.app.makeMenu(this.app.player, this.app.cursor.position);

    // TODO: Implement input handlers for each menu
    // Keep hidden for now since no way to interact with and close menu
    // menu.show();

    menu.on('selected', function(){
      done();
    });


    Debug.log('Action finished');
};
