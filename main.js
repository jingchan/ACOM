/**
 * Creates game instance and adds to html
 */

'use strict';
var $ = require('jquery');

var Phaser = require('phaser');
var App = require('./lib');
// Create renderer and add to DOM element

var viewx = 800;
var viewy = 680;
var tileSize = 40;
var game = new Phaser.Game(viewx, viewy, Phaser.AUTO, 'gameDiv');
game.app = null;

var mainState = {
  // required by Phaser

  preload: function() {
    game.tileSize = tileSize;
    game.viewport = [viewx, viewy];

    // TODO: automate all of these.
    // load sprites
    game.load.image('monkey', 'monkey.png');
    game.load.image('randi', 'randi.png');
    game.load.image('bunny', 'bunny.png');
    game.load.image('vivi-trans', 'vivi-trans.png');
    game.load.image('xcom-soldier', 'xcom-soldier.png');

    // load sprite sheets
    game.load.spritesheet('vanessa2', 'vanessa1.png', 373, 267);
    game.load.spritesheet('edgar', 'edgar.png', 32, 48, 4);

    // load tiles
    game.load.image('wall', 'wall.png');
    game.load.image('grass', 'grass.png');
    game.load.image('water', 'water.png');
    game.load.image('cursor', 'cursor.png');
  },

  create: function() {
    game.loadedSprites = {};
    ['wall', 'grass', 'water', 'cursor'].map(function(x) {
      game.loadedSprites[x] = game.add.group();
      game.loadedSprites[x].createMultiple(400,x);
    });
    ['xcom-soldier', 'monkey','randi','bunny', 'vivi-trans', 'edgar'].map(function(x) {
      game.loadedSprites[x] = game.add.group(); // Create a group
      game.loadedSprites[x].createMultiple(5, x);
    });
    game.loadedSprites['cursor'] = game.add.sprite(0, 0, 'cursor');
    game.loadedSprites['cursor'].alpha = 0.7;

    /*
    var vanessa = game.add.sprite(300, 180, 'vanessa2');
    vanessa.animations.add('supaa');
    vanessa.animations.play('supaa', 10, true);
     */
  },

  update: function() {
    // game logic, etc.

    // need to move app initialization here to make sure the app stuff happens afterwards.
    // async programming gotcha!
    if (game.app === null) {
      game.app = App(game);
      game.app.initialize();
    }
    game.app.animateStep();
  }
};

game.state.add('main', mainState);
game.state.start('main');
