/**
 * ## Menu Item
 * Represents an item on the menu
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
