/**
 * ## Renderer
 * Generates visual display of app
 */

'use strict';

var Debug = require('../debug');

var _ = require('underscore');
var Phaser = require('phaser');
var exports = module.exports = CreateRenderer;


/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function CreateRenderer(scene, game){
	var renderer = Object.create(CreateRenderer.prototype);

	renderer.scene = scene;
  renderer.game = game;
	renderer.tileSize = game.tileSize;
  renderer.viewport = game.viewport;

	renderer.renderObjects = [];

	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
    // at this point the sprite has already been created if the entity has one;
    // we tell the renderer that the entity is due for rendering.
    entity.getComponent('visual').shouldRender = true;
    Debug.log("Renderer should now care about entity!");
	});

	scene.on('entityWillBeRemoved', function(entity){
    // TODO: should really play with the visual component instead
    entity.getComponent('visual').destroy();
	});

	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
		_addMapToStage(map, game, renderer.tileSize);
    map.shouldRender = true;
    Debug.log("Renderer should now care about the map!");

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
  Debug.log("Renderer should now care about the RenderObject!");
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
    if (map.shouldRender) {
		  map.eachTile(function(tile, i, j){
			  tile.sprite.reset(i * that.tileSize, j * that.tileSize);
		  });
      // and now, the renderer should probably not care about it.
      map.shouldRender = false;
    };
	});

	// Update screen-space position of entities
	if(scene.entities){
		scene.entities.forEach(function(entity){
      var visual = entity.getComponent('visual');
      if (visual.shouldRender) {
			  // Update positions
        //
        // recall that grid things are anchored to bottom middle, where their
        // feet are.

        // TODO: the anchoring only needs to be done once...
        visual.sprite.reset((entity.position.x + 0.5) * that.tileSize,
			                      (entity.position.y + 1) * that.tileSize);
        visual.shouldRender = false;
      }
		});
	};

  // I think eventually wer should just have this one function, and everything should have
  // its own renderobject
  this.renderObjects.forEach(function(ro) {
    if (ro.shouldRender) {
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