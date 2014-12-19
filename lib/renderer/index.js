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

	renderer.renderObjects = []; // not sure we need this

	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
    // at this point the sprite has already been created if the entity has one;
    // we tell the renderer that the entity is due for rendering.
    entity.shouldRender = true;
    // Debug.log("Renderer should now care about entity!");

	});
	scene.on('entityWillBeRemoved', function(entity){
		if(entity.sprite){
      entity.sprite.destroy();
		}
	});

	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
		_addMapToStage(map, game, renderer.tileSize);
    map.shouldRender = true;
    // Debug.log("Renderer should now care about the map!");

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
  console.log("wait we are already here?");
  console.log(renderObject);
  // Debug.log("Renderer should now care about the RenderObject!");
  this.renderObjects.push(renderObject);

  // this.pixi.overlayLayer.addChild(renderObject.display);
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
      map.shouldRender = false;
    };
	});

	// Update screen-space position of entities
	if(scene.entities){
		scene.entities.forEach(function(entity){
      if (entity.shouldRender) {
			  // Update positions
			  entity.sprite.reset((entity.position.x) * that.tileSize,
			                      (entity.position.y) * that.tileSize);

			  // Update rotations
			  if(entity.rotation){
				  entity.sprite.rotation = entity.rotation;
			  }
        entity.shouldRender = false;
      }
		});
	};

  // I think eventually wer should just have this one function, and everything should have
  // its own renderobject
  this.renderObjects.forEach(function(ro) {
    if (ro.shouldRender) {
      ro.render();
      // TODO: right now nothing, but eventually they probably animate or something.
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
		// if(!tileType.texture){
		// 	tileType.texture = _loadTexture(tileType.imagePath);
		// }

		// if(!tile.sprite){
		// 	tile.sprite = _loadSprite(tileType.texture);
		// 	stage.addChild(tile.sprite);
		// }

		if(!tile.sprite){
      var group = game.terrain[tileType.name];
			tile.sprite = game.terrain[tileType.name].getFirstDead();
      tile.sprite.reset(i * tileSize, j * tileSize);
      // _loadSprite(tileType.texture);
			// stage.addChild(tile.sprite);
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


// /**
//  * Create Texture and Sprite for entity if needed
//  * @param {Entity} entity Entity to be augmented
//  * @private
//  */
// exports.prototype._addSpriteToEntityIfNeeded = function(entity){
// 	if(!entity.sprite){
// 		if(entity.image){
// 			if(entity.image.type === 'image'){
// 				// var texture = _loadTexture(entity.image.path);
// 				// entity.sprite = _loadSprite(texture);

//         // this.game.load.image(entity.image.path,
//         //                      entity.image.path);
//         entity.sprite = new Phaser.Sprite(this.game,
//                                           entity.position.x * this.tileSize,
//                                           entity.position.y * this.tileSize,
//                                           entity.image.name);

// 				if(typeof entity.image.anchor !== 'undefined'){
// 					entity.sprite.anchor.x = entity.image.anchor.x;
// 					entity.sprite.anchor.y = entity.image.anchor.y;
// 				}

// 			} else if (entity.image.type === 'box'){
// 				var box = new PIXI.Graphics();
// 				box.beginFill(entity.image.color, entity.image.alpha);

// 				box.drawRect(-this.tileSize / 2, -this.tileSize / 2, this.tileSize, this.tileSize);

// 				entity.sprite = box;
// 			}

// 			if(typeof entity.image.alpha !== 'undefined'){
// 				entity.sprite.alpha = entity.image.alpha;
// 			}
// 		}
// 	}
// };

// /**
//  * Loads a texture from image file at path
//  * @param  {String} path Path to image file
//  * @return {Texture}      Texture with image loaded
//  */
// function _loadTexture(path){
// 	return PIXI.Texture.fromImage(path);
// }

// /**
//  * Loads a Sprite from a Texture
//  * @param  {Texture} texture Texture to be loaded into sprite
//  * @return {Sprite}         Sprite with texture
//  */
// function _loadSprite(texture){
// 	return new PIXI.Sprite(texture);
// }
