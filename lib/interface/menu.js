/**
 * ## Menu
 * Describes menus and implements menu functionality
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var exports = module.exports = Menu;

/**
 * Menu base class
 * @param {Array} items      Menu Items
 * @param {Object} opts      Additional Options
 */
function Menu(items, opts){
  opts = opts || {};
  EventEmitter.call(this);

  // Defines whether or not menu selection should cycle
  this.verticalWrap = opts.verticalWrap || true;

  // Describes type of menu
  this.type = opts.type || 'hover_tile';
  this.tilePosition = opts.tilePosition || {x: 0, y: 0};
  this.actor = opts.actor;
	this.selectedIndex = 0;

  this.items = [];
  var that = this;
  items.forEach(function(mi){
    that.addItem(mi);
  });

  this.acceptingInput = false;
}
util.inherits(Menu, EventEmitter);

Menu.prototype.addItem = function(menuItem){
	this.items.push(menuItem);
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

Menu.prototype.show = function(){
  this.acceptingInput = true;
  this.emit('show');
};

Menu.prototype.hide = function(){
  this.acceptingInput = false;
  this.emit('hide');
};
