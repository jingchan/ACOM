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
function MenuRenderObject(renderer, menu){
	RenderObject.call(this, renderer, menu.name + "-renderObj");

  var TS = renderer.tileSize;
  this.TS = TS;
  this.game = renderer.game;
  this.padding = [TS, 0.5*TS];

  this.fontObj = { font: '24px Arial', fill: '#fff' };
	this.menu = menu;

  // upper-left corner of the menu
  this.position = {x:menu.tilePosition.x*TS,
                   y:menu.tilePosition.y*TS};

	this.menuSize = {x:8*TS,
                   y:this.padding[1]*2 + menu.items.length*TS};

	this.display = new PIXI.DisplayObjectContainer();

  // these are the things actually being displayed:
  // - [[ bkSprite ]] the background sprite (with dynamically-created texture)
  // - [[ electionDisplay]] = the cursor (text)
  // - the item texts live in [[menuTexts]]

  this.selectionDisplay = null;
  this.bkSprite = null;
  this.menuTexts = [];

	if(menu.type === 'hover_tile'){
 		this._generateHoverMenu();
  } else {
		throw new Error('Menu type not supported: ' + menu.type);
 	}

	this.state = 'hiding';
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
    self.shouldRender = true;
		self.state = 'hiding';
	});


}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.render = function() {
  var index = this.menu.selectedIndex;

  if (this.state === 'hiding') {
    this.bkSprite.renderable = false;
    this.selectionDisplay.renderable = false;
    for (var i = 0; i < this.menuTexts.length; i++) {
      this.menuTexts[i].renderable = false;
    }
  } else if (this.state === 'showing') {
	  this._repositionHoverMenu();
    this.bkSprite.position.x = this.position.x;
    this.bkSprite.position.y = this.position.y;
    this.selectionDisplay.position.x = this.position.x + 0.5*this.TS;
    for (var i = 0; i < this.menuTexts.length; i++) {
      var gap = i*this.TS;
      this.menuTexts[i].position.x = this.position.x + this.TS;
      this.menuTexts[i].position.y = this.position.y + this.TS*0.5 + gap;
    }

    if (this.menuTexts.length > 0) {
      this.selectionDisplay.position.y = this.menuTexts[index].position.y;
    } else {
      this.selectionDisplay.position.y = 0;
    }

    this.bkSprite.renderable = true;
    this.selectionDisplay.renderable = true;
    for (var j = 0; j < this.menuTexts.length; j++) {
      this.menuTexts[j].renderable = true;
    }
  } else {
    Debug.log("should never get here...");
  }
};

exports.prototype._generateHoverMenu = function(){
  // TODO: be careful here about garbage collection!

  var game = this.game;
  var menu = this.menu;
  var TS = this.TS;

  this.display.removeChildren();

	// [[ Background ]]
	var backingDisplay = new PIXI.Graphics();
	backingDisplay.lineStyle(2, 0xffffff, 1);
	backingDisplay.beginFill(0x0000ff, 1);
	backingDisplay.drawRect(
		0,
		0,
		this.menuSize.x,
		this.menuSize.y
	);
	this.display.addChild(backingDisplay);

  var texture = new PIXI.RenderTexture(this.menuSize.x, this.menuSize.y);
  texture.render(this.display);

  // these are the things actually being displayed:
  // - the background sprite
  // - the cursor (text)
  // - the item texts
  if (this.bksprite) {
    this.bkSprite.destroy();
  }
  this.bkSprite = game.add.sprite(0,
                                  0,
                                  texture);

  this.selectionDisplay = game.add.text(0.5*TS, 0.5*TS, '>', this.fontObj);

  // generate all texts
  this.menuTexts = [];
  for (var i = 0; i < menu.items.length; i++) {
    var gap = i*TS;
    this.menuTexts.push(game.add.text(TS, 0.5*TS + gap, menu.items[i].text,
                                      this.fontObj));
  }
};

exports.prototype._repositionHoverMenu = function(){
  this.position.x = Math.max(this.menu.tilePosition.x * this.TS, 0);
  this.position.y = Math.max(this.menu.tilePosition.y * this.TS, 0);

	// Flip to left of cursor if horizontal overflow
	if(this.position.x > this.game.width - this.menuSize.x){
		this.position.x -= this.menuSize.x - this.TS;
	}
	// Cap bottom if vertical overflow
	this.position.y = Math.min(this.position.y,
                             this.game.height - this.menuSize.y);
};