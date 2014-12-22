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

			visual.display = game.add.group();
      Debug.log("entity", JSON.stringify(entity.position));
      var displayPosition = renderer._tileToPosition(entity.position.x,
                                                     entity.position.y);
      visual.display.position = displayPosition;
      Debug.log("made thing", JSON.stringify(displayPosition));
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
			visual.shouldRender = true;

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
          visual.healthText.setText(healthComp.health.toString());
        });

        // we certainly don't want cursors to explode
        entity.on("destroy", function(data) {
          // TODO: death/explosion animation
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
		map.shouldRender = true;
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
	Debug.log("Renderer sees", "renderObject!");
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
	// Update screen-space position of map
	// I think phaser takes care of all of this?
	var scene = this.scene;
	var that = this;

	scene.maps.forEach(function(map){
		// TODO: Implement scrolling
    // TODO: map should probably be a renderObject
		if (map.shouldRender) {
			Debug.log("Renderer drawing", "map");
			map.eachTile(function(tile, i, j){
				tile.sprite.reset(i * that.tileSize, j * that.tileSize);
			});
			// and now, the renderer should probably not care about it.
			map.shouldRender = false;
		};
	});

	// Update screen-space position of entities
  // TODO: may want this code back later, but for now we are just drawing
  //       entities on an event-based manner and not in a loop.
  //
	// if(scene.entities){
	// 	scene.entities.forEach(function(entity){
	// 		var visual = entity.getComponent('visual');
	// 		if (visual.shouldRender) {

	// 			Debug.log("Renderer drawing entity", entity.name);
	// 			// Update positions

  //       visual.display.position = that._tileToPosition(entity.position.x,
  //                                                      entity.position.y);
  //       Debug.log("updated position to", JSON.stringify(visual.display.position));
	// 			visual.shouldRender = false;
	// 		}
	// 	});
	// };

	this.renderObjects.forEach(function(ro) {
		if (ro.shouldRender) {
			Debug.log("Renderer drawing", "renderObject");
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
	map.eachTile(function(tile, i, j){
		var tileType = tile.tileType;

		if(!tile.sprite){

			tile.sprite = game.loadedSprites[tileType.name].getFirstDead();
			tile.sprite.reset(i * tileSize, j * tileSize);
		}
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
			// game.load.spritesheet('vanessa2', 'vanessa1.png', 373, 267);
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

      // create the team identifier icons
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