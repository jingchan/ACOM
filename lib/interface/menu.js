/**
 * ##Menu
 * Represents a menu in game
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Menu;

/**
 * Menu base class
 * @param {int} x      x position (screen space)
 * @param {int} y      y position (screen space)
 * @param {width} width  width (screen space)
 * @param {Object} opts Options for configuring menu
 */
function Menu(items, opts){
  opts = opts || {};
  EventEmitter.call(this);

  this.verticalWrap = opts.verticalWrap || true;
  this.type = opts.type || 'hover_tile';
  this.tilePosition = opts.tilePosition || {x: 0, y: 0};

	this.size = [opts.width, 0];
	
	this.selectedIndex = 0;

  this.items = [];
  var that = this;
  items.forEach(function(mi){
    that.addItem(mi);
  });
}
util.inherits(Menu, EventEmitter);

Menu.prototype.addItem = function(menuItem){
	this.items.push(menuItem);
  this.size[1] = this.items.length * 40 + 10;
};

Menu.prototype.moveUp = function() {
  if(this.verticalWrap){
    if (this.selectedIndex > 0) {
      this.selectedIndex -= 1;
    } else {
      this.selectedIndex = this.items.length - 1;
    }
  } else {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);  
  }

	this.emit('selectionChanged', this.selectedIndex);
};

Menu.prototype.moveDown = function() {
  if(this.verticalWrap){
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex += 1;
    } else {
      this.selectedIndex = 0;
    }
  } else {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.items.length - 1);
  }
	
	this.emit('selectionChanged', this.selectedIndex);
};

Menu.prototype.selectCurrent = function() {
	this.items[this.selectedIndex].func();
	this.emit('selected', this.items[this.selectedIndex]);
};

Menu.prototype.destroy = function(){
	this.emit('destroy');
	this.removeAllListeners();
};
