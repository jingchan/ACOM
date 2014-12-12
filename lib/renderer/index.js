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
	renderer.pixi.renderer = PIXI.autoDetectRenderer(700, 500);

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


	// create a texture from an image path
	var texture = _loadTexture('bunny.png');
	// create a new Sprite using the texture
	var bunny = new PIXI.Sprite(texture);

	// center the sprites anchor point
	bunny.anchor.x = 0.5;
	bunny.anchor.y = 0.5;

	// move the sprite t the center of the screen
	bunny.position.x = 200;
	bunny.position.y = 150;

	renderer.pixi.stage.addChild(bunny);

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
		for (var i = 0; i < map.length; i++){
			for (var j = 0; j < map[i].length; j++) {
				var tile = map[i][j];

				tile.sprite.position.x = 40 * j;
				tile.sprite.position.y = 40 * i;
			}
		}
	});

	if(scene.entities){
		scene.entities.forEach(function(entity){
			// Update positions			
			entity.sprite.position.x = entity.position.x;
			entity.sprite.position.y = entity.position.y;

			// Update rotations
			if(entity.rotation)
				entity.sprite.rotation = entity.rotation;

		});
	}

	this.pixi.renderer.render(this.pixi.stage);
};


function _addMapToStage(map, stage){
	if(!map){
		return;
	}
	for (var i = 0; i < map.length; i++){
		for (var j = 0; j < map[i].length; j++) {
			var tile = map[i][j];
			var tileType = tile.tileType;

			if(!tileType.texture){
				tileType.texture = _loadTexture(tileType.imagePath);
			}

			if(!tile.sprite){
				tile.sprite = _loadSprite(tileType.texture);
				stage.addChild(tile.sprite);
			}
		}
	}
}

function _removeMapFromStage(map, stage){
	if(!map){
		return;
	}

	for (var i = 0; i < map.length; i++){
		for (var j = 0; j < map[i].length; j++) {
			var tile = map[i][j];
			if(tile.sprite){
				stage.removeChild(tile.sprite);
			}
		}
	}
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