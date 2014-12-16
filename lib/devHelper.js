/**
 * ##Devhelper
 *  * Responds to mouse input
 * Notes: This functionality probably should not be a component
 * example usage:
 *  - factory to put player characters on map during dev
 *  - choosing formations, equipping, etc.
 *
 * Extremely non-decoupled code. Sorry!!!!
 *
 */

'use strict';

var Debug = require('./debug');
var PIXI = require('pixi.js');

var exports = module.exports = Dragger;

/*
 * Creates a sprite that can be dragged to instantiate new players
 *
 */
function Dragger(app, imagePath, x, y){
  var dragSprite = new PIXI.Sprite(PIXI.Texture.fromImage(imagePath));
  dragSprite.interactive = true;
  dragSprite.buttonMode = true;
  var stage = app.stage;

	dragSprite.mousedown = function(data) {
			this.data = data;
			this.alpha = 0.9;
			this.dragging = true;
	};

	dragSprite.mouseup = dragSprite.mouseupoutside = function(data)
	{
		var newPosition = this.data.getLocalPosition(this.parent);
    var gx = Math.round(newPosition.x / 40);
    var gy = Math.round(newPosition.y / 40);
    Debug.log("new position", JSON.stringify(newPosition));
    Debug.log("new position (grid)", JSON.stringify({x:gx, y:gy}));
    this.position.x = x;
    this.position.y = y;
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
    app.makePlayer(gx, gy, imagePath);
  };

	// set the callbacks for when the mouse or a touch moves
	dragSprite.mousemove = function(data)
	{
		if(this.dragging)
		{
			// need to get parent coords..
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
	};

	// move the sprite to its designated position
	dragSprite.position.x = x;
	dragSprite.position.y = y;
  stage.addChild(dragSprite);
}
