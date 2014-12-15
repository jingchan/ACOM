/**
 * ## Menu RenderObject
 * Renders a menu
 */

'use strict';

var Debug = require('../debug');
var PIXI = require('pixi.js');
var RenderObject = require('./renderObject');
var util = require('util');

var exports = module.exports = MenuRenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function MenuRenderObject(menu){
	RenderObject.call(this);

	this.renderer = null;

	this.display = new PIXI.DisplayObjectContainer();
	this.menu = menu;

	this.padding = [40, 20];

	var self = this;
	menu.on('selectionChanged', function(index){
		if(self.selectionDisplay){
			self.selectionDisplay.position.y = self.items[index].position.y;
		}
	});
	menu.on('destroy', function(){
		self.renderer.removeRenderObject(self);
	});
}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.initializeWithRenderer = function(renderer){
	this.renderer = renderer;
	this.display.removeChildren();
	this.constructMenu();
};

exports.prototype.constructMenu = function(){
	if(!this.renderer){
		throw new Error('Cannot generate menu without first setting the renderer');
	}

	var menu = this.menu;
	if(menu.type === 'hover_tile'){
		this._generateHoverMenu();
	} else {
		throw new Error('Menu type not supported: ' + menu.type);
	}
};


exports.prototype._generateHoverMenu = function(){
	var renderer = this.renderer;
	var menu = this.menu;

	var tilePosition = this.menu.tilePosition;
	var menuOrigin = [(tilePosition[0] + 1) * renderer.tileSize, tilePosition[1] * renderer.tileSize];
	var menuSize = menu.size;

	// Adjust position for overflows
	menuOrigin[0] = Math.max(menuOrigin[0], 0);
	menuOrigin[1] = Math.max(menuOrigin[1], 0);
	// Flip to left of cursor if horizontal overflow
	if(menuOrigin[0] > renderer.viewport[0] - menuSize[0]){
		menuOrigin[0] = menuOrigin[0] - menuSize[0] - renderer.tileSize;
	}
	// Cap bottom if vertical overflow
	menuOrigin[1] = Math.min(menuOrigin[1], renderer.viewport[1] - menuSize[1]);

	// Construct menu background
	var backingDisplay = new PIXI.Graphics();
	backingDisplay.lineStyle(2, 0xffffff, 1);
	backingDisplay.beginFill(0x0000ff, 1);
	backingDisplay.drawRect(
		menuOrigin[0],
		menuOrigin[1],
		menuSize[0],
		menuSize[1]
	);

	this.backingDisplay = backingDisplay;
	this.display.addChild(backingDisplay);


	// Construct menu items
	var heightTravelled = 0;
	var padding = 10;

	this.itemDisplay = new PIXI.DisplayObjectContainer();
	this.items = [];
	var self = this;

	menu.items.forEach(function(item){
		var text = new PIXI.Text(item.text);
		text.position.x = menuOrigin[0] + self.padding[0];
		text.position.y = menuOrigin[1] + self.padding[1] + heightTravelled;

		self.items.push(text);
		self.itemDisplay.addChild(text);

		heightTravelled += text.height + padding;
	});

	this.display.addChild(this.itemDisplay);

	// Replace this with a better graphic
	var selectionDisplay = new PIXI.Text('>');
	selectionDisplay.position.x = menuOrigin[0] + 10;
	selectionDisplay.position.y = this.items[this.menu.selectedIndex].position.y;

	this.selectionDisplay = selectionDisplay;
	this.display.addChild(selectionDisplay);
};
