/**
 * ## Renderer
 * Generates visual display of app
 */

'use strict';

var PIXI = require('pixi.js');

var exports = module.exports = CreateRenderer;

function CreateRenderer(){
	var renderer = Object.create(CreateRenderer.prototype);
	renderer.pixi = {};

	// create an new instance of a pixi stage
	renderer.pixi.stage = new PIXI.Stage(0x66FF99);

	// create a renderer instance.
	renderer.pixi.renderer = PIXI.autoDetectRenderer(700, 500);

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
CreateRenderer.prototype.getView = function() {
	return this.pixi.renderer.view;
};

/**
 * updates viewport to match scene object
 * @param  {Scene}
 */
exports.prototype.renderScene = function(scene){
	if(scene.map){
		for (var i = 0; i < scene.map.length; i++){
			for (var j = 0; j < scene.map[i].length; j++) {
				// TODO: Tiles should be loaded prior to this point
				var tile = scene.map[i][j];
				var tileType = tile.tileType;

				if(!tileType.texture){
					tileType.texture = _loadTexture(tileType.imagePath);
				}

				if(!tile.sprite){
					tile.sprite = _loadSprite(tileType.texture);
					this.pixi.stage.addChild(tile.sprite);

				}

				tile.sprite.position.x = 40 * i;
				tile.sprite.position.y = 40 * j;
			}
		}
	}

	this.pixi.renderer.render(this.pixi.stage);
};


function _loadTexture(path){
	return PIXI.Texture.fromImage(path);
}

function _loadSprite(texture){
	return new PIXI.Sprite(texture);
}