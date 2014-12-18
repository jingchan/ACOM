/**
 * ## Menu RenderObject
 * Renders a menu
 */

'use strict';

var Debug = require('../debug');
var PIXI = require('pixi.js');
var Phaser = require('phaser');
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
	this.display.alpha = 0;
	this.menu = menu;
  this.sprite = null;

	this.padding = [40, 20];
	this.menuSize = [200, this.padding[1] * 2];

	// Register event listeners
	// TODO: implement cleanup/removal for these handlers
	var self = this;
	menu.on('selectionChanged', function(index){
		if(self.selectionDisplay){
			self.selectionDisplay.position.y = self.items[index].position.y;
		}
	});

	menu.on('destroy', function(){
		self.renderer.removeRenderObject(self);
	});

	this.state = '';

  var that = this;
	menu.on('show', function(){
		self.state = 'showing';
		// self._repositionHoverMenu();
    that.texture = new PIXI.RenderTexture(that.menuSize[0], that.menuSize[1]);
    that.texture.render(that.display);

    // we must already have a renderer!
    var game = that.renderer.game;

    that.sprite = game.add.sprite(that.display.position.x,
                                  that.display.position.y,
                                  that.texture);
    console.log(that.sprite);
    Debug.log("coordinates: ", JSON.stringify(that.display.position));
    Debug.log("should have made a sprite!");

	});

	menu.on('hide', function(){
		self.state = 'hiding';
	});


}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.initializeWithRenderer = function(renderer){
	this.renderer = renderer;
	this.reconstructMenu();
};

exports.prototype.reconstructMenu = function(){
	if(!this.renderer){
		throw new Error('Cannot generate menu without first setting the renderer');
	}
	this.display.removeChildren();

	var menu = this.menu;
	if(menu.type === 'hover_tile'){
		this._generateHoverMenu();
	} else {
		throw new Error('Menu type not supported: ' + menu.type);
	}
};

exports.prototype._generateHoverMenu = function(){

  Debug.log("DArio!");

	var menu = this.menu;
	var menuSize = [200, this.padding[1] * 2];

	// [[ Item List ]]
	var heightTravelled = 0;
	var padding = 10;

	this.itemDisplay = new PIXI.DisplayObjectContainer();
	this.items = [];
	var self = this;

  if (menu.items) {
	  menu.items.forEach(function(item){
		  var text = new PIXI.Text(item.text);
		  text.position.x = self.padding[0];
		  text.position.y = self.padding[1] + heightTravelled;

		  self.items.push(text);
		  self.itemDisplay.addChild(text);

		  heightTravelled += text.height + padding;
	  });
  }

  Debug.log("Wario!");

	// Adjust size of menu to accomodate items
	menuSize[1] += heightTravelled - padding;

	// [[ Background ]]
	var backingDisplay = new PIXI.Graphics();
	backingDisplay.lineStyle(2, 0xffffff, 1);
	backingDisplay.beginFill(0x0000ff, 1);
	backingDisplay.drawRect(
		0,
		0,
		menuSize[0],
		menuSize[1]
	);
	this.backingDisplay = backingDisplay;

	// [[ Selection Indicator ]]
	// TODO: Replace this with a better graphic
	var selectionDisplay = new PIXI.Text('>');
	selectionDisplay.position.x = 10;
	selectionDisplay.position.y = this.items[this.menu.selectedIndex].position.y;
	this.selectionDisplay = selectionDisplay;

	this.display.addChild(this.backingDisplay);
	this.display.addChild(this.itemDisplay);
	this.display.addChild(this.selectionDisplay);

	// this._repositionHoverMenu();
};

exports.prototype._repositionHoverMenu = function(){
	var renderer = this.renderer;
	var tilePosition = this.menu.tilePosition;
	var menuSize = [200, this.padding[1] * 2];

	// [[ Item List ]]
	var heightTravelled = 0;
	var padding = 10;

  if (this.items) {
	  this.items.forEach(function(text){
		  heightTravelled += text.height + padding;
	  });
  }

	// Adjust size of menu to accomodate items
	menuSize[1] += heightTravelled - padding;

	// Adjust position for overflows
	var menuOrigin = [(tilePosition[0] + 1) * renderer.tileSize, tilePosition[1] * renderer.tileSize];
	menuOrigin[0] = Math.max(menuOrigin[0], 0);
	menuOrigin[1] = Math.max(menuOrigin[1], 0);
	// Flip to left of cursor if horizontal overflow
	if(menuOrigin[0] > renderer.viewport[0] - menuSize[0]){
		menuOrigin[0] = menuOrigin[0] - menuSize[0] - renderer.tileSize;
	}
	// Cap bottom if vertical overflow
	menuOrigin[1] = Math.min(menuOrigin[1], renderer.viewport[1] - menuSize[1]);

	this.display.position.x = menuOrigin[0];
	this.display.position.y = menuOrigin[1];
  this.menuSize = menuSize;
};


exports.prototype.update = function(){
	// if(this.state === 'showing'){
	// 	this.display.alpha = Math.min(this.display.alpha + 0.05, 1);
	// 	if(this.display.alpha >= 1){
	// 		this.state = '';
	// 	}
	// }	else if(this.state === 'hiding'){
	// 	this.display.alpha = Math.max(this.display.alpha - 0.05, 0);
	// 	if(this.display.alpha <= 0){
	// 		this.state = '';
	// 	}
	// }
};
