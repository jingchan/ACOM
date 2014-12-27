/**
 * Initialize Phaser game object.
 *
 */

'use strict';

var Phaser = require('phaser');
var exports = module.exports = initializePhaser;

function initializePhaser(renderer, viewx, viewy, tileSize, gameDiv, completionHandler) {
	var game = new Phaser.Game(viewx, viewy, Phaser.AUTO, gameDiv);

	var mainState = {

		preload: function() {
			// TODO: automate all of these.

			// load sprites
			game.load.image('monkey', 'monkey.png');
			game.load.image('randi', 'randi.png');
			game.load.image('bunny', 'bunny.png');
			game.load.image('vivi-trans', 'vivi-trans.png');
			game.load.image('xcom-soldier', 'xcom-soldier.png');

			// load sprite sheets
			game.load.spritesheet('vanessa', 'vanessa1.png', 373, 267);
			game.load.spritesheet('edgar', 'edgar.png', 32, 48, 4);
      game.load.spritesheet('explosion', 'explosion.png', 128, 128);

			// load tiles
			game.load.image('wall', 'wall.png');
			game.load.image('grass', 'grass.png');
			game.load.image('water', 'water.png');
			game.load.image('cursor', 'cursor.png');

      // load tileSets
      game.load.image('ground_tiles', 'ground_tiles.png');
      // cheating a bit: visibility is just putting a pic of a wall
      // for now.
			game.load.image('visibility_tiles', 'wall.png');
		},

		create: function() {
      game.loadedSprites = {};
      // we make the groups layer by layer; this helps Phaser
      // deal with visibility. Groups that are created first will
      // always be under groups that are created afterwards.
      renderer.mapLayer = game.add.group();

      renderer.entityLayer = game.add.group();
      renderer.topLayer = game.add.group();

      // TODO: eventually should just have 1
      game.loadedSprites['cursor'] = game.add.group(renderer.topLayer);
      game.loadedSprites['cursor'].createMultiple(5);

      /**
       * game.topLayer
       * Now we make things like health bars, animations, etc.
       */
      var bunny = game.loadedSprites['bunny'] = renderer.topLayer.create(0,0,'bunny');
      bunny.anchor.setTo(0.5, 0.5);
      bunny.kill(); // we reuse it later for bullets.

      var vanessaFist = game.loadedSprites['vanessaFist'] = renderer.topLayer.create(0,0,'vanessa');
      vanessaFist.animations.add('default');
      vanessaFist.kill();

      var explosion = game.loadedSprites['explosion'] = renderer.topLayer.create(0,0,'explosion');
      explosion.kill();
      explosion.anchor.setTo(0.5, 0.1);
      explosion.animations.add('boom');

      // text loaded for animating damange
      var damageText = game.loadedSprites['damageText'] = game.add.text(0,0,
         "", {font: "20px Arial", fill: "#ff0000"}, renderer.topLayer);
      damageText.alpha = 0;

      completionHandler();
		},

		update: function() {
			renderer.update(renderer.scene);
		}
	};

	game.state.add('main', mainState);
	game.state.start('main');

	return game;
}
