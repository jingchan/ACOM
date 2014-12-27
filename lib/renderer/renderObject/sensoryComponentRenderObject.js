/**
 * ## SensoryComponent RenderObject
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');

var exports = module.exports = SensoryComponentRenderObject;

/**
 * Constructor
 */
function SensoryComponentRenderObject(renderer, sensory){
  RenderObject.call(this, renderer);

  this.map = sensory.owner.scene.map;

  var tileSize = this.renderer.tileSize;
  var game = this.renderer.game;

  this.visibleTileMap = game.add.tilemap(null, tileSize, tileSize);
  this.visibleTileMap.create('visibilityLayer-' + sensory.owner.name,
                             this.map.width, this.map.height,
                             tileSize, tileSize,
                             this.display);

  // visibility_tiles is a janky little tileset with a single image
  // of a blocked-out vision
  this.visibleTileMap.addTilesetImage('visibility_tiles');

  this.map.eachTile(function(tile, i, j){
    // right now, this just puts a wall at every tile, which is
    // at index 0 because it is the first (and only) image in
    // the tileSet. As we do more complicated things, we should
    // change this 0 to something else.
    this.visibleTileMap.putTile(0, i, j);
  });
}
util.inherits(SensoryComponentRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;
    var self = this;
    this.map.eachTile(function(tile, i, j) {
      if (this.sensory.visibilityMask[j][i]) {
        self.visibleTileMap.getTile(i,j).alpha = 0;
      } else {
        self.visibleTileMap.getTile(i,j).alpha = 1;
      }
  });
};
