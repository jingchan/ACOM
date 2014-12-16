/**
 * ## Renderer
 * Generates visual display of app
 */

'use strict';

var Debug = require('../debug');

var _ = require('underscore');
var PIXI = require('pixi.js');
var exports = module.exports = CreateRenderer;



/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function CreateRenderer(scene){
	var renderer = Object.create(CreateRenderer.prototype);

	renderer.scene = scene;
	renderer.tileSize = 40;
	renderer.viewport = [20 * renderer.tileSize, 14 * renderer.tileSize];

	renderer.renderObjects = [];

	// hold our pixi-specific stuff here
	var pixi = renderer.pixi = {};

	// create an new instance of a pixi stage
	pixi.stage = new PIXI.Stage(0x000000);

	// Create map layer
	pixi.mapLayer = new PIXI.DisplayObjectContainer();
	pixi.stage.addChild(pixi.mapLayer);

	pixi.entityLayer = new PIXI.DisplayObjectContainer();
	pixi.stage.addChild(pixi.entityLayer);

	pixi.overlayLayer = new PIXI.DisplayObjectContainer();
	pixi.stage.addChild(pixi.overlayLayer);


	// create a pixi renderer instance.
	renderer.pixi.renderer = PIXI.autoDetectRenderer(renderer.viewport[0], renderer.viewport[1]);

	// Add current map
	_addMapToStage(scene.map, pixi.mapLayer);

	// For existing entities, add to pixi stage
	scene.entities.forEach(function(entity){
		_addSpriteToEntityIfNeeded(entity);
		pixi.entityLayer.addChild(entity.sprite);
	});


	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
		//create sprite
		_addSpriteToEntityIfNeeded(entity);
		pixi.entityLayer.addChild(entity.sprite);
	});
	scene.on('entityWillBeRemoved', function(entity){
		if(entity.sprite){
			pixi.entityLayer.removeChild(entity.sprite);
		}
	});


	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
		_addMapToStage(map, pixi.mapLayer);
	});
	scene.on('mapWillBeRemoved', function(map){
		_removeMapFromStage(map, pixi.mapLayer);
	});

	return renderer;
}

/**
 * Returns DOM node with the viewport
 * @return {Element}
 */
exports.prototype.getView = function() {
	return this.pixi.renderer.view;
};

/**
 * Adds a renderObject to the stage
 * @param {RenderObject} renderObject RenderObject to be added
 */
exports.prototype.addRenderObject = function(renderObject){
	renderObject.renderer = this;
	renderObject.initializeWithRenderer(this);
	this.renderObjects.push(renderObject);
	this.pixi.overlayLayer.addChild(renderObject.display);
};

/**
 * Removes a renderObject fromthe stage
 * @param {RenderObject} renderObject RenderObject to be removed
 */
exports.prototype.removeRenderObject = function(renderObject){
	renderObject.renderer = null;

	this.renderObjects = _.reject(this.renderObjects, function(ro){ 
		return ro === renderObject; 
	});

	this.pixi.overlayLayer.removeChild(renderObject.display);
};



/**
 * updates viewport to match scene object
 * @param  {Scene}
 */
exports.prototype.renderScene = function(){
	// Update screen-space position of map
	var scene = this.scene;
	var that = this;
	scene.maps.forEach(function(map){
		// TODO: Implement scrolling
		map.eachTile(function(tile, i, j){
			tile.sprite.position.x = i * that.tileSize;
			tile.sprite.position.y = j * that.tileSize;
		});
	});

	// Update screen-space position of entities
	if(scene.entities){
		scene.entities.forEach(function(entity){
			// Update positions			
			entity.sprite.position.x = entity.position.x * that.tileSize;
			entity.sprite.position.y = entity.position.y * that.tileSize;

			// Update rotations
			if(entity.rotation){
				entity.sprite.rotation = entity.rotation;
			}

		});
	}

	this.renderObjects.forEach(function(ro){
		ro.update();
	});

	this.pixi.renderer.render(this.pixi.stage);
};

/**
 * Iterates over map object and generates/adds appropriate sprites to Pixy stage
 * @param {Map} map   Map to be added
 * @param {Stage} stage Stage that Map is added to
 * @private
 */
function _addMapToStage(map, stage){
	if(!map || !map.grid){
		return;
	}
	map.eachTile(function(tile){
		var tileType = tile.tileType;

		if(!tileType.texture){
			tileType.texture = _loadTexture(tileType.imagePath);
		}

		if(!tile.sprite){
			tile.sprite = _loadSprite(tileType.texture);
			stage.addChild(tile.sprite);
		}
	});
}

/**
 * Removes map tiles from the Pixy Stage
 * @param  {Map} map   Map to be removed
 * @param  {Stage} stage Pixi Stage to be removed from
 * @private
 */
function _removeMapFromStage(map, stage){
	if(!map){
		return;
	}

	map.eachTile(function(tile){
		if(tile.sprite){
			stage.removeChild(tile.sprite);
		}
	});
}


/**
 * Create Texture and Sprite for entity if needed
 * @param {Entity} entity Entity to be augmented
 * @private
 */
function _addSpriteToEntityIfNeeded(entity){
	if(!entity.sprite){
		if(entity.image){
			if(entity.image.type === 'image'){
				var texture = _loadTexture(entity.image.path);
				entity.sprite = _loadSprite(texture);
			} else if (entity.image.type === 'box'){
				var box = new PIXI.Graphics();
				box.beginFill(entity.image.color, entity.image.alpha);
				box.drawRect(0, 0, 40, 40);
				entity.sprite = box;
			}
			if(typeof entity.image.anchor !== 'undefined'){
				entity.sprite.anchor = entity.image.anchor;
			}
			if(typeof entity.image.alpha !== 'undefined'){
				entity.sprite.alpha = entity.image.alpha;
			}
		}
	}
}

/**
 * Loads a texture from image file at path
 * @param  {String} path Path to image file
 * @return {Texture}      Texture with image loaded
 */
function _loadTexture(path){
	return PIXI.Texture.fromImage(path);
}

/**
 * Loads a Sprite from a Texture
 * @param  {Texture} texture Texture to be loaded into sprite
 * @return {Sprite}         Sprite with texture
 */
function _loadSprite(texture){
	return new PIXI.Sprite(texture);
}

