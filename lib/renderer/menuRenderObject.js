/**
 * ## Menu RenderObject
 * - Renders a menu
 * - Produces ACOM specific styling
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
  this._menuSize = [200, 100];

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

    
    if(this.menu.type === 'hover_tile'){
      this._generateHoverMenu();
      this._repositionHoverMenu();
    } else {
      throw new Error('Menu type not supported: ' + this.menu.type);
    }
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
  var game = this.renderer.game;

  this.display.removeAll();

  // [[ Item List ]]
  var heightTravelled = 0;
  var maxItemWidth = 0;
  var innerItemPadding = 10;

  this.itemDisplay = game.add.group();
  this.items = [];
  var self = this;

  menu.items.forEach(function(item){
    var text = game.add.text(0, 0, item.text, self.fontStyle, self.itemDisplay);
    text.position.x = self.padding[0];
    text.position.y = self.padding[1] + heightTravelled;

    self.items.push(text);

    heightTravelled += text.height + innerItemPadding;
    maxItemWidth = Math.max(maxItemWidth, text.width);
  });

  // Adjust size of menu to accomodate items
  this._menuSize[0] = Math.max(200, maxItemWidth + 2 * self.padding[0]);
  this._menuSize[1] = Math.max(100, heightTravelled - innerItemPadding + 2 * self.padding[1]);

  // [[ Background ]]
  var backingDisplay = game.add.graphics(0, 0);
  backingDisplay.lineStyle(2, 0xffffff, 1);
  backingDisplay.beginFill(0x0000ff, 1);
  backingDisplay.drawRect(
    0,
    0,
    this._menuSize[0],
    this._menuSize[1]
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

  // Adjust position for overflows
  var menuOrigin = [(tilePosition.x + 1) * renderer.tileSize, tilePosition.y * renderer.tileSize];
  menuOrigin[0] = Math.max(menuOrigin[0], 0);
  menuOrigin[1] = Math.max(menuOrigin[1], 0);
  // Flip to left of cursor if horizontal overflow
  if(menuOrigin[0] > renderer.viewport[0] - this._menuSize[0]){
    menuOrigin[0] = menuOrigin[0] - this._menuSize[0] - renderer.tileSize;
  }
  // Cap bottom if vertical overflow
  menuOrigin[1] = Math.min(menuOrigin[1], renderer.viewport[1] - this._menuSize[1]);

  this.display.position.x = menuOrigin[0];
  this.display.position.y = menuOrigin[1];
};
