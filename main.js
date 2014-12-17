/**
 * Creates game instance and adds to html
 */

'use strict';
var $ = require('jquery');

var Phaser = require('phaser');
// Create renderer and add to DOM element

var game = new Phaser.Game(800, 680, Phaser.AUTO, 'gameDiv');

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
    for (var x in ['wall', 'grass', 'water']) {
      game.terrain[x] = this.game.add.group();
      game.terrain[x].createMultiple(30,x);
    }
    for (var y in ['monkey','randi','bunny', 'vivi-trans']) {
      game.PCs[x] = this.game.add.group(); // Create a group
      game.PCs[x].createMultiple(5, x); // Create 20 pipes
    }
    console.log("wtf");
    console.log(this.game);
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
    // if (this.bird.inWorld ===  false) {
    //   this.restartGame();
    // };
    // game logic, etc.
  }
};

game.state.add('main', mainState);
game.state.start('main');

console.log("game should have started");

var app = require('./lib')(game);
app.initialize();

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
