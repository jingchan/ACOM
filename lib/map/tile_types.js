/**
 * Defines tile types
 */
'use strict';

var tileConfig = [
	['grass', 'grass.png'],
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
	var tileType = {
		name: name,
		imagePath: imagePath,
		options: options
	};

	return tileType;
}

module.exports = tileTypes;
