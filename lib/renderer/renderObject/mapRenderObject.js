/**
 * ## Map RenderObject
 * - Renders a map
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');

var exports = module.exports = MapRenderObject;

/**
 * Constructor for MapRenderObject
 */
function MapRenderObject(renderer, map){
  RenderObject.call(this, renderer);

  this.map = map;

  var tileSize = this.renderer.tileSize;
  var game = this.renderer.game;

  this.tileMap = game.add.tilemap(null, tileSize, tileSize);

  // TODO: This stuff should be generated from ./map/tileTypes
  // TODO: Code should fit how we make our resources, not the other way around.
  this.tileMap.addTilesetImage('ground_tiles');
  this.tileToPhaserTileIndex = {
    'wall': 0,
    'grass': 1,
    'water': 2
  };

  // Style parameters

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  // TODO: Listen to map for changes and updated accordingly
  // map.on('event', function(){
  // });
}
util.inherits(MapRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;

    // TODO: Don't need to fully reconstruct every time
    this.display.removeAll();

    this._addMapToStage();
  }
};

exports.prototype._addMapToStage = function (){
  var tileSize = this.renderer.tileSize;
  var map = this.map;
  var tileMap = this.tileMap;

  tileMap.create('tileLayer', map.width, map.height, tileSize, tileSize, this.display);

  var that = this;

  map.eachTile(function(tile, i, j){
    var tileType = tile.tileType;
    var tileIndex = that.tileToPhaserTileIndex[tileType.name];

    tileMap.putTile(tileIndex, i, j);
  });
};

exports.prototype.handleVisibleTiles = function (visibleTiles) {
  console.log(this.tileMap);
  console.log(this.tileMap.layers[0]);
  console.log(this.tileMap.getLayer(0));
  console.log(this.tileMap.getLayerIndex('tileLayer'));
  for (var x = 0; x < this.map.width; x++) {
    for (var y= 0; y < this.map.height; y++) {
      if (!(visibleTiles[y][x])) {
        //console.log([x,y]);
        //console.log(this.tileMap.getTile(x,y, 0));
        // this.tileMap.getTile(x,y, 'tileLayer').alpha = 0.5;
      };
    }
  }
};