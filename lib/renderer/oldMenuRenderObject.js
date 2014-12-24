/**
 * ## Menu RenderObject
 * Renders a menu
 */

'use strict';

var Debug = require('../debug');
var RenderObject = require('./renderObject');
var util = require('util');

var exports = module.exports = MenuRenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function MenuRenderObject(renderer, menu){
  RenderObject.call(this, renderer);

  this.menu = menu;
  this._visible = false;

  // Style parameters
  this.padding = [40, 20];
  this.fontStyle = { font: '24px Arial', fill: '#fff' };

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  var self = this;
  menu.on('selectionChanged', function(index){
    this.dirty = true;
    if(self.selectionDisplay){
      self.selectionDisplay.position.y = self.items[index].position.y;
    }
  });

  menu.on('destroy', function(){
    self.renderer.removeRenderObject(self);
  });


  menu.on('show', function(){
    self._visible = true;
    self.dirty = true;
  });

  menu.on('hide', function(){
    self._visible = false;
    self.dirty = true;
  });
}
util.inherits(MenuRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;
    this._updateVisibility();
    this._generateHoverMenu();
    this._repositionHoverMenu();
  }
};

exports.prototype._updateVisibility = function(){
  if(this._visible){
    this.display.visible = true;
  } else {
    this.display.visible = false;
  }
};

exports.prototype._generateHoverMenu = function(){
  var menu = this.menu;
  var menuSize = [200, this.padding[1] * 2];

  var game = this.renderer.game;

  this.display.removeAll();

  // [[ Item List ]]
  var heightTravelled = 0;
  var padding = 10;

  this.itemDisplay = game.add.group();
  this.items = [];
  var self = this;

  menu.items.forEach(function(item){
    var text = game.add.text(0, 0, item.text, self.fontStyle, self.itemDisplay);
    text.position.x = self.padding[0];
    text.position.y = self.padding[1] + heightTravelled;

    self.items.push(text);

    heightTravelled += text.height + padding;
  });

  // Adjust size of menu to accomodate items
  menuSize[1] += heightTravelled - padding;

  // [[ Background ]]
  var backingDisplay = game.add.graphics(0, 0);
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
  var selectionDisplay = game.add.text(0, 0, '>', self.fontStyle);
  selectionDisplay.position.x = 10;
  selectionDisplay.position.y = this.items[this.menu.selectedIndex].position.y;
  this.selectionDisplay = selectionDisplay;

  this.display.add(this.backingDisplay);
  this.display.add(this.itemDisplay);
  this.display.add(this.selectionDisplay);
  
  this._repositionHoverMenu();
};

exports.prototype._repositionHoverMenu = function(){
  var renderer = this.renderer;
  var tilePosition = this.menu.tilePosition;
    var menuSize = [200, this.padding[1] * 2];

  // [[ Item List ]]
  var heightTravelled = 0;
  var padding = 10;

  this.items.forEach(function(text){
    heightTravelled += text.height + padding;
  });

  // Adjust size of menu to accomodate items
  menuSize[1] += heightTravelled - padding;

  // Adjust position for overflows
  var menuOrigin = [(tilePosition.x + 1) * renderer.tileSize, tilePosition.y * renderer.tileSize];
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
};
