/**
 * Creates game instance and adds to html
 */

'use strict';
var $ = require('jquery');

var Phaser = require('phaser');
var App = require('./lib');
// Create renderer and add to DOM element

var game = new Phaser.Game(800, 680, Phaser.AUTO, 'gameDiv');
game.app = null;

var mainState = {
  preload: function() {
    // load assets, etc.
    // game.stage.backgroundColor = '#71c5cf';
    game.load.image('monkey', 'monkey.png');
    game.load.image('randi', 'randi.png');
    game.load.image('bunny', 'bunny.png');
    game.load.image('vivi-trans', 'vivi-trans.png');
    game.load.image('wall', 'wall.png');
    game.load.image('grass', 'grass.png');
    game.load.image('water', 'water.png');
  },

  create: function() {
    game.terrain = {};
    game.PCs = {};
    ['wall', 'grass', 'water'].map(function(x) {
      game.terrain[x] = game.add.group();
      game.terrain[x].createMultiple(400,x);
    });
    ['monkey','randi','bunny', 'vivi-trans'].map(function(x) {
      game.PCs[x] = game.add.group(); // Create a group
      game.PCs[x].createMultiple(5, x); // Create 20 pipes
    });
    // setup game, display sprites, etc.
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    // this.bird = this.game.add.sprite(100,245, 'randi');

    // game.physics.arcade.enable(this.bird);
    // this.bird.body.gravity.y = 500;

    // var spaceKey =
    //   this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // spaceKey.onDown.add(this.jump, this);
  },

  update: function() {

    // need to move here to make sure the app stuff happens afterwards.
    // async programming!!!
    if (game.app === null) {
      game.app = App(game);
      game.app.initialize();
    }
    // if (this.bird.inWorld ===  false) {
    //   this.restartGame();
    // };
    // game logic, etc.
  }
};

game.state.add('main', mainState);
game.state.start('main');

console.log("game should have started");



// $(document).ready(function(){
// 	// Add view to the DOM
// 	//document.body.appendChild(app.getView());
// 	var firstChild = document.body.firstChild;
// 	document.body.insertBefore(app.getView(), firstChild);


// 	// Create animation loop
// 	function animate() {
// 		window.requestAnimationFrame( animate );

// 		// Step the scene forward
// 		app.animateStep();
// 	}
// 	window.requestAnimationFrame( animate );

// });
