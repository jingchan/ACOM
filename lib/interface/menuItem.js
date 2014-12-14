/**
 * ##Menu
 * Represents a menu in game
 */
'use strict';

var exports = module.exports = MenuItem;

/**
 * Menu Item base class
 * @param {string} text      Text to display
 * @param {Function} func      Function to call when selected
 */
function MenuItem(text, func){
	this.text = text;
	this.func = func;
}
