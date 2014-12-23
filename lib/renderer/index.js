/**
 * ## Renderer
 * Generates visual display of app
 */

'use strict';

var Debug = require('../debug');

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var Phaser = require('phaser');
var exports = module.exports = CreateRenderer;
var util = require('util');

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function CreateRenderer(app, scene, viewx, viewy, tileSize){
	var renderer = Object.create(CreateRenderer.prototype);
	EventEmitter.call(renderer);
	util.inherits(renderer, EventEmitter);

	renderer.app = app;
	renderer.scene = scene;
	var game = renderer.game = renderer.initializeGame(viewx, viewy, tileSize);
	renderer.tileSize = game.tileSize;

	// grid things are anchored to bottom middle, where feet are
  renderer._tileToPosition = function(x, y) {
    return new Phaser.Point((x + 0.5) * renderer.tileSize,
	                      (y + 1) * renderer.tileSize);
  };

	renderer.viewport = game.viewport;

	renderer.renderObjects = [];

	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
		// we create the sprite with the entity's visual component, if it has one
		var visual = entity.getComponent('visual');
		if (visual) {

			visual.display = game.add.group(game.entityLayer);
      var displayPosition = renderer._tileToPosition(entity.position.x,
                                                     entity.position.y);
      visual.display.position = displayPosition;
      var sprite = visual.display.create(0,
                                         0,
                                         visual.spriteHandle);
      if (!!entity.team) {
        // this is how you look up shit from the cache
        var teamMarker = visual.display.create(-renderer.tileSize/2, 0, game.cache.getBitmapData(entity.team));
        teamMarker.anchor.setTo(0.5,0.5);

      }
			if (!!visual.spriteOpts.alpha) {
				sprite.alpha = visual.spriteOpts.alpha;
			}

			// give their "just stand there" animation
			if (!!visual.spriteOpts.animated) {
				sprite.animations.add('default');
				sprite.animations.play('default', 4, true);
			}

			// for grid-y based things (like entities), we want the anchor to be on bottom
			// middle (feet).
			sprite.anchor.setTo(0.5, 1);

      entity.on('successAttack', function(data) {
        var source = renderer._tileToPosition(data.x1, data.y1);
        var target = renderer._tileToPosition(data.x2, data.y2);
        var dist = Phaser.Math.distance(source.x,
                                        source.y,
                                        target.x,
                                        target.y)/(renderer.tileSize * renderer.tileSize);
        if (data.renderKey === 'bunnyBullet') {
          var bullet = game.loadedSprites['bunny'];
          bullet.reset(source.x, source.y);
          bullet.alpha = 1;
          game.add.tween(bullet).to({x:target.x, y:target.y},
                                    800).start();
          game.add.tween(bullet).to({alpha: 0}, 1000).start();
        } else if (data.renderKey === 'vanessaFist') {
          var vanessa = game.loadedSprites['vanessaFist'];
          vanessa.reset(target.x - 200, target.y - 230);
          vanessa.alpha = 1;
          // ('key', frameRate, loop, killOnComplete).
          // I don't kill because I want her to smooth out
          vanessa.animations.play('default', 7, false);
          game.add.tween(vanessa).to({alpha: 0}, 3500).start();
        } else if (data.renderKey === 'chainsaw') {
          // TODO: chainsaw!
        }
      });


      entity.on('successMove', function(data) {
        if (data.x1 === data.x2 && data.y1 === data.y2) {
          // stupid bug that involves things moving infinitely far, so don't
          // do anything if the move doesn't change positions
        } else {
          var source = renderer._tileToPosition(data.x1, data.y1);
          var target = renderer._tileToPosition(data.x2, data.y2);
          var dist = Phaser.Math.distance(source.x,
                                          source.y,
                                          target.x,
                                          target.y)/(renderer.tileSize * renderer.tileSize);
          game.add.tween(visual.display).to({x:target.x, y:target.y},
                                            1000*dist/visual.spriteOpts.moveSpeed).start();
        }
      });

      var healthComp = entity.getComponent('healthComponent');
      if (healthComp) {
        // add to the visual.display container a text about the health
        visual.healthText = game.add.text(0, 0, healthComp.health.toString(),
                                          {font: "16px Arial", fill: "#ffffff"},
                                          visual.display);
        entity.on("damage", function(data) {
          Debug.log("we do we get here?", healthComp.health);
          var damageText = game.loadedSprites['damageText'];
          var target = renderer._tileToPosition(entity.position.x,
                                                entity.position.y);
          damageText.setText(data.damage.toString());
          damageText.position = target;
          damageText.alpha = 1;
          game.add.tween(damageText).to({y: target.y - 40}, 500)
              .to({y:target.y}, 500)
              .to({y:target.y}, 500)
              .to({alpha:0}, 400)
              .start();
          visual.healthText.setText(healthComp.health.toString());
        });

        // we certainly don't want cursors to explode
        entity.on("destroy", function(data) {
          var target = renderer._tileToPosition(entity.position.x,
                                                entity.position.y);
          var explosion = game.loadedSprites['explosion'];
          explosion.reset(target.x, target.y-40, 'explosion');
          explosion.play('boom', 15, false, true);
        });
      }

			Debug.log("Renderer created entity", entity.name);
		}

	});

	scene.on('entityWillBeRemoved', function(entity){
		// TODO: should we destroy the visual component? It seems garbage collection
		//       should work...
		var visual = entity.getComponent('visual');
		if (visual) {
			visual.display.destroy();
		}
	});

	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
		_addMapToStage(map, game, renderer.tileSize);
		// map.shouldRender = true;
		Debug.log("Renderer sees", "map");

	});
	scene.on('mapWillBeRemoved', function(map){
		_removeMapFromStage(map, game);
	});

	scene.on('renderObjectRemoved', function(renderObject) {
		renderObject.renderer = null;
	});

	return renderer;
}

exports.prototype.addRenderObject = function(renderObject){
	// right now, the sprite has probably already been created;
	// make it visible. I think the philosophy is that the logic
	// creating the renderObject should already know where to put
	// it on the screen, etc.

	// renderObject.initializeWithRenderer(this);
	renderObject.shouldRender = true;
	Debug.log("Renderer sees", renderObject.name);
	this.renderObjects.push(renderObject);
};

exports.prototype.removeRenderObject = function(renderObject){
	renderObject.renderer = null;
	this.renderObjects = _.reject(this.renderObjects, function(ro){
		return ro === renderObject;
	});
	renderObject.destroy();
};



/**
 * updates viewport to match scene object
 * @param  {Scene}
 */
exports.prototype.renderScene = function(){

  // right now the Phaser loop updates sprites in an event-based fashion
  // for maps and entities. The only code that still checks for flags is
  // for renderObjects, which should eventually be treated the same way,
  // making this function obselete.

	this.renderObjects.forEach(function(ro) {
		if (ro.shouldRender) {
			Debug.log("Renderer drawing", ro.name);
			ro.render();
			ro.shouldRender = false;
		}
	});
};


/**
 * Iterates over map object and generates/adds appropriate sprites to Pixy stage
 * @param {Map} map   Map to be added
 * @param {Stage} stage Stage that Map is added to
 * @private
 */
function _addMapToStage(map, game, tileSize){
	if(!map || !map.grid){
		return;
	}
	var that = this;

  game.tileMap.createBlankLayer('visibleLevel', map.width, map.height,
                                tileSize, tileSize,
                                game.mapLayer);
  game.tileMap.createBlankLayer('sightBlockingLevel', map.width, map.height,
                                tileSize, tileSize,
                                game.mapLayer);

	map.eachTile(function(tile, i, j){
		var tileType = tile.tileType;
    var tileIndex = game.tileToPhaserTileIndex[tileType.name];
    var layerName =  (!!tileType.options.blocksSight ?
                      'sightBlockingLevel' : 'visibleLevel');
    game.tileMap.putTile(tileIndex, i, j, layerName);
	});
}

/**
 * Removes map tiles from the Pixy Stage
 * @param  {Map} map   Map to be removed
 * @param  {Stage} stage Pixi Stage to be removed from
 * @private
 */
function _removeMapFromStage(map, game){
	if(!map){
		return;
	}

	map.eachTile(function(tile){
		if(tile.sprite){
			tile.sprite.destroy();
		}
	});
}

/**
 * Initialize Phaser game object.
 *
 */
exports.prototype.initializeGame = function(viewx, viewy, tileSize, gameDiv) {

	var game = new Phaser.Game(viewx, viewy, Phaser.AUTO, gameDiv);
	game.tileSize = tileSize;
	game.viewport = [viewx, viewy];

	var that = this;
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

			Debug.log("Phaser Game Finished! Now Postrender.");
			that.app.postRendererCreation();

		},

		update: function() {
			that.scene.update();
			that.renderScene(that.scene);
		}
	};

	game.state.add('main', mainState);
	game.state.start('main');

	return game;
}
