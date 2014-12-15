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

this.display = new PIXI.DisplayObjectContainer();
	this.menu = menu;

	this.padding = [40, 20];

	this.constructMenu();

	var self = this;
	menu.on('selectionChanged', function(index){
		self.selectionDisplay.position.y = self.items[index].position.y;
	});
	menu.on('destroy', function(){
		self.renderer.removeRenderObject(self);
	});
}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.constructMenu = function(){
	var menu = this.menu;

	// Construct menu background
	this.backingDisplay = new PIXI.Graphics();
	this.backingDisplay.lineStyle(2, 0xffffff, 1);
	this.backingDisplay.beginFill(0x0000ff, 1);
	this.backingDisplay.drawRect(
		menu.origin[0],
		menu.origin[1],
		menu.size[0],
		menu.size[1]
	);
	this.display.addChild(this.backingDisplay);


	// Construct menu items
	var heightTravelled = 0;
	var padding = 10;

	this.itemDisplay = new PIXI.DisplayObjectContainer();
	this.items = [];
	var self = this;

	this.menu.items.forEach(function(item){
		var text = new PIXI.Text(item.text);
		text.position.x = menu.origin[0] + self.padding[0];
		text.position.y = menu.origin[1] + self.padding[1] + heightTravelled;

		self.items.push(text);
		self.itemDisplay.addChild(text);

		heightTravelled += text.height + padding;
	});

	this.display.addChild(this.itemDisplay);

	this.selectionDisplay = new PIXI.Text('>');

  // console.debug("menu.origin: " + menu.origin);
  // console.debug("menu x: " + (menu.origin[0] + 10));
  // console.debug("menu y: " + this.items[this.menu.selectedIndex].position.y);

	this.selectionDisplay.position.x = menu.origin[0] + 10;
	this.selectionDisplay.position.y = this.items[this.menu.selectedIndex].position.y;
	this.display.addChild(this.selectionDisplay);
};
