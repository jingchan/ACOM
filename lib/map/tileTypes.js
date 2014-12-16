/**
 * Defines tile types
 */

'use strict';

var tileConfig = [
	['grass', 'grass.png', {walkable: true}],
	['wall', 'wall.png', {walkable: false, blocksProjectiles: true}],
	['water', 'water.png', {walkable: false}]
];

var tileTypes = [];

tileConfig.forEach(function(t){
	tileTypes.push(new TileType(t[0], t[1], t[2]));
});

/**
 * represents a unit of terrain
 * @param {string}
 * @param {string}
 * @param {Object}
 */
function TileType(name, imagePath, options){
	this.name = name || '';
	this.imagePath = imagePath || 'default.png';
	this.options = options || {};
}

/**
 * Gets a property of the tile
 * @param  {string} prop Name of property
 * @return {value}      Value of that property
 */
TileType.prototype.getProperty = function(prop){
	return this.options[prop];
};

module.exports = tileTypes;
