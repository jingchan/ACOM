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
 * @param {height} height height (screen space)
 */
function Menu(x, y, width, height){
	EventEmitter.call(this);

	this.origin = [x, y];
	this.size = [width, height];

	this.position = 'bottom';
	
	this.items = [];
	this.selectedIndex = 0;
}
util.inherits(Menu, EventEmitter);

Menu.prototype.addItem = function(menuItem){
	this.items.push(menuItem);
};

Menu.prototype.moveUp = function() {
	this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
	this.emit('selectionChanged', this.selectedIndex);
};

Menu.prototype.moveDown = function() {
	this.selectedIndex = Math.min(this.selectedIndex + 1, this.items.length - 1);
	this.emit('selectionChanged', this.selectedIndex);
};

Menu.prototype.selectCurrent = function() {
	this.items[this.selectedIndex].func();
	this.emit('selected', this.items[this.selectedIndex]);
};

Menu.prototype.destroy = function(){
	this.emit('destroy');
	this.removeListeners();
};
