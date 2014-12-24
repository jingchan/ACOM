/**
 * Initialize Phaser game object.
 *
 */

'use strict';

var Phaser = require('phaser');
var exports = module.exports = initializePhaser;

function initializePhaser(renderer, viewx, viewy, tileSize, gameDiv) {

	var game = new Phaser.Game(viewx, viewy, Phaser.AUTO, gameDiv);
	game.tileSize = tileSize;
	game.viewport = [viewx, viewy];

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
		},

		create: function() {
      game.loadedSprites = {};
      // we make the groups layer by layer; this helps Phaser
      // deal with visibility. Groups that are created first will
      // always be under groups that are created afterwards.
      game.mapLayer = game.add.group();

      game.tileMap = game.add.tilemap(null, tileSize, tileSize);

      // Now we need 2 things: a Phaser.Tileset, and also a reverselookup
      // that allows us to get the phaser tile index from the tileSet
      // entered above; should match the order in 'groundTileSet.png";
      // TODO: automate this

      game.tileMap.addTilesetImage('ground_tiles');
      game.tileToPhaserTileIndex = {'wall': 0,
                                    'grass': 1,
                                    'water': 2};

      // TODO: this is for things like objects.
      // game.objectTileSet = game.tileMap.addTilesetImage('');

			// ['wall', 'grass', 'water', 'cursor'].map(function(x) {
			// 	game.loadedSprites[x] = game.add.group(game.mapLayer);
		  // 		game.loadedSprites[x].createMultiple(400,x);
			// });

      game.entityLayer = game.add.group();
      game.topLayer = game.add.group();

      // TODO: eventually should just have 1
      game.loadedSprites['cursor'] = game.add.group(game.topLayer);
      game.loadedSprites['cursor'].createMultiple(5);

      /**
       * game.topLayer
       * Now we make things like health bars, animations, etc.
       */
      var teamData = [{key:'good', color:'#f0ff0f'},
                      {key:'evil', color:'#ff0000'}];
      teamData.forEach(function(data) {
        // http://www.html5gamedevs.com/topic/5683-add-bitmapdata-to-cache-as-image/
        var bmd = game.add.bitmapData(10,10);
        bmd.ctx.beginPath();
        bmd.ctx.rect(0,0,10,10);
        bmd.ctx.fillStyle = data.color;
        bmd.ctx.fill();
        game.cache.addBitmapData(data.key, bmd);
      });

      var bunny = game.loadedSprites['bunny'] = game.topLayer.create(0,0,'bunny');
      bunny.anchor.setTo(0.5, 1);
      bunny.kill(); // we reuse it later for bullets.

      var vanessaFist = game.loadedSprites['vanessaFist'] = game.topLayer.create(0,0,'vanessa');
      vanessaFist.animations.add('default');
      vanessaFist.kill();

      var explosion = game.loadedSprites['explosion'] = game.topLayer.create(0,0,'explosion');
      explosion.kill();
      explosion.anchor.setTo(0.5, 0.1);
      explosion.animations.add('boom');

      // text loaded for animating damange
      var damageText = game.loadedSprites['damageText'] = game.add.text(0,0,
         "", {font: "20px Arial", fill: "#ff0000"}, game.topLayer);
      damageText.alpha = 0;

			renderer.app.postRendererCreation();

		},

		update: function() {
			renderer.update(renderer.scene);
		}
	};

	game.state.add('main', mainState);
	game.state.start('main');

	return game;
}
