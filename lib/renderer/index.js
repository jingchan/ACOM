/**
 * ## Renderer
 * Generates visual display of app
 */

'use strict';

var PIXI = require('pixi.js');

var exports = module.exports = CreateRenderer;

function CreateRenderer(scene){
	var renderer = Object.create(CreateRenderer.prototype);

	renderer.scene = scene;

	// hold our pixi-specific stuff here
	renderer.pixi = {};

	// create an new instance of a pixi stage
	renderer.pixi.stage = new PIXI.Stage(0x66FF99);

	// create a pixi renderer instance.
	renderer.pixi.renderer = PIXI.autoDetectRenderer(800, 560);

	// Add current map
	_addMapToStage(scene.map, renderer.pixi.stage);

	// For existing entities, add to pixi stage
	scene.entities.forEach(function(entity){
		_addSpriteToEntityIfNeeded(entity);
		renderer.pixi.stage.addChild(entity.sprite);
	});


	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
		//create sprite
		_addSpriteToEntityIfNeeded(entity);
		renderer.pixi.stage.addChild(entity.sprite);
	});
	scene.on('entityWillBeRemoved', function(entity){
		if(entity.sprite){
			renderer.pixi.stage.removeChild(entity.sprite);
		}
	});


	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
		_addMapToStage(map, renderer.pixi.stage);
	});
	scene.on('mapWillBeRemoved', function(map){
		_removeMapFromStage(map, renderer.pixi.stage);
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
 * updates viewport to match scene object
 * @param  {Scene}
 */
exports.prototype.renderScene = function(){
	var scene = this.scene;
	scene.maps.forEach(function(map){
		map.eachTile(function(tile, i, j){
			tile.sprite.position.x = 40 * i;
			tile.sprite.position.y = 40 * j;
		});
	});

	if(scene.entities){
		scene.entities.forEach(function(entity){
			// Update positions			
			entity.sprite.position.x = entity.position.x;
			entity.sprite.position.y = entity.position.y;

			// Update rotations
			if(entity.rotation){
				entity.sprite.rotation = entity.rotation;
			}

		});
	}

	this.pixi.renderer.render(this.pixi.stage);
};


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


function _addSpriteToEntityIfNeeded(entity){
	if(!entity.sprite){
		entity.texture = _loadTexture(entity.imagePath);
		entity.sprite = _loadSprite(entity.texture);
		entity.sprite.anchor = entity.anchor;
	}
}

function _loadTexture(path){
	return PIXI.Texture.fromImage(path);
}

function _loadSprite(texture){
	return new PIXI.Sprite(texture);
}
