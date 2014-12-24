/**
 * ## Map RenderObject
 * - Renders a map
 */

'use strict';

var Debug = require('../debug');
var RenderObject = require('./renderObject');
var util = require('util');

var exports = module.exports = MapRenderObject;

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function MapRenderObject(renderer, map){
  RenderObject.call(this, renderer);

  this.map = map;

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
    this._addMapToStage();
  }
};

exports.prototype._addMapToStage = function (){
  var tileSize = this.renderer.tileSize;
  var game = this.renderer.game;
  var map = this.map;

  game.tileMap.createBlankLayer('visibleLevel', map.width, map.height,
                                tileSize, tileSize,
                                this.display);
  game.tileMap.createBlankLayer('sightBlockingLevel', map.width, map.height,
                                tileSize, tileSize,
                                this.display);

  map.eachTile(function(tile, i, j){
    var tileType = tile.tileType;
    var tileIndex = game.tileToPhaserTileIndex[tileType.name];
    var layerName =  (!!tileType.options.blocksSight ?
                      'sightBlockingLevel' : 'visibleLevel');
    game.tileMap.putTile(tileIndex, i, j, layerName);

  });
};
