/**
 * ## Menu RenderObject
 * - Renders a menu
 * - Captures ACOM specific styling
 */

'use strict';

var Debug = require('../debug');
//var PIXI = require('pixi.js');
var Phaser = require('phaser');
var RenderObject = require('./renderObject');
var util = require('util');

var exports = module.exports = MenuRenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function MenuRenderObject(renderer, menu){
	RenderObject.call(this, renderer, menu.name + "-renderObj");

  var tileSize = renderer.tileSize;

  this.game = renderer.game;
	this.menu = menu;

  // Styling variables
  this.padding = [tileSize, 0.5 * tileSize];
  this.fontStyle = { font: '24px Arial', fill: '#fff' };


  // upper-left corner of the menu
  this.position = {x:menu.tilePosition.x*tileSize,
                   y:menu.tilePosition.y*tileSize};

	this.menuSize = {x:8*tileSize,
                   y:this.padding[1]*2 + menu.items.length*tileSize};

	//this.display = new PIXI.DisplayObjectContainer();
  this.display = this.game.add.group(this.game.topLayer);

	if(menu.type === 'hover_tile'){
 		this._generateHoverMenu();
  } else {
		throw new Error('Menu type not supported: ' + menu.type);
 	}

	this.state = 'hiding';
  this.shouldRender = true;

	// Register event listeners
	// TODO: implement cleanup/removal for these handlers
	var self = this;
	menu.on('selectionChanged', function(){
    self.shouldRender = true;
	});

	menu.on('destroy', function(){
		self.renderer.removeRenderObject(self);
	});

  var that = this;
	menu.on('show', function(){
		self.state = 'showing';
    self.shouldRender = true;
		// self._repositionHoverMenu();
	});

	menu.on('hide', function(){
    // counterintuitive, but "shouldRender" is about "should the renderer care
    // now that you have changed?" (basically, it isn't about invisibility; the
    // only person that should shut it off is the render function
		self.state = 'hiding';
    self.shouldRender = true;
	});


}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.render = function() {
  var index = this.menu.selectedIndex;
  var tileSize = this.renderer.tileSize;

  if (this.state === 'hiding') {
    this.display.visible = false;
  } else if (this.state === 'showing') {
	  this._repositionHoverMenu();
    // this.bkSprite.position.x = this.position.x;
    // this.bkSprite.position.y = this.position.y;

    this.backingDisplay.position.x = this.position.x;
    this.backingDisplay.position.y = this.position.y;

    this.selectionDisplay.position.x = this.position.x + 0.5*tileSize;
    for (var i = 0; i < this.menuTexts.length; i++) {
      var gap = i*tileSize;
      this.menuTexts[i].position.x = this.position.x + tileSize;
      this.menuTexts[i].position.y = this.position.y + tileSize*0.5 + gap;
    }

    if (this.menuTexts.length > 0) {
      this.selectionDisplay.position.y = this.menuTexts[index].position.y;
    } else {
      this.selectionDisplay.position.y = 0;
    }

    this.display.visible = true;

  } else {
    Debug.log("should never get here...");
  }
};

exports.prototype._generateHoverMenu = function(){
  // TODO: be careful here about garbage collection!

  var game = this.game;
  var menu = this.menu;
  var tileSize = this.renderer.tileSize;

  // these are the things actually being displayed:
  // - [[ backingDisplay ]] the background rectangle
  // - [[ electionDisplay]] = the cursor (text)
  // - the item texts live in [[menuTexts]]
	// [[ Background ]]
  this.backingDisplay = this.game.add.graphics(0, 0, this.display);

	this.backingDisplay.lineStyle(2, 0xffffff, 1);
	this.backingDisplay.beginFill(0x0000ff, 1);
	this.backingDisplay.drawRect(
		0,
		0,
		this.menuSize.x,
		this.menuSize.y
	);

  this.selectionDisplay = this.game.add.text(0.5*tileSize, 0.5*tileSize, '>', this.fontStyle, this.display);
  this.menuTexts = [];

  // generate all texts
  this.menuTexts = [];
  for (var i = 0; i < menu.items.length; i++) {
    var gap = i*tileSize;
    this.menuTexts.push(game.add.text(tileSize, 0.5*tileSize + gap,
                                      menu.items[i].text,
                                      this.fontStyle,
                                      this.display));
  }
};

exports.prototype._repositionHoverMenu = function(){
  var tileSize = this.renderer.tileSize;
  this.position.x = Math.max(this.menu.tilePosition.x * tileSize, 0);
  this.position.y = Math.max(this.menu.tilePosition.y * tileSize, 0);

	// Flip to left of cursor if horizontal overflow
	if(this.position.x > this.game.width - this.menuSize.x){
		this.position.x -= this.menuSize.x - tileSize;
	}
	// Cap bottom if vertical overflow
	this.position.y = Math.min(this.position.y,
                             this.game.height - this.menuSize.y);
};