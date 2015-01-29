/**
 * ## range RenderObject
 *
 * For things like selecting movement range, firing ranges, etc.
 *
 */

'use strict';

var Debug = require('../../debug');

var RenderObject = require('./index');
var util = require('util');

var exports = module.exports = RangeRenderObject;

/**
 * Constructor
 */
function RangeRenderObject(renderer, map, range){
  RenderObject.call(this, renderer);

  this.map = map;
  this.range = range;

  var tileSize = this.renderer.tileSize;
  var game = this.renderer.game;

  this.movableTileMap = game.add.tilemap(null, tileSize, tileSize);
  this.movabilityLayer = this.movableTileMap.create('movableLayer',
                             this.map.width, this.map.height,
                             tileSize, tileSize,
                             this.display);

  // Currently stealing from visibility... TODO: don't
  this.movableTileMap.addTilesetImage('movement_tiles');
  this.tileToPhaserTileIndex = {'movingVisual': 0};
  var self = this;

  // this tells us if the agent is currently "thinking." important
  // for the renderObject to know since someone else's FOW doesn't
  // apply to my FOW...
  this.movabilityLayer.visible = false;

  this.range.on('makingMoveRange', function() {
    Debug.log("thinking about movement for", self.range.name);
    self.movabilityLayer.visible = true;
    self.dirty = true;
  });
  this.range.on('removingMoveRange', function() {
    Debug.log("No longer thinking about movement for", self.range.name);
    self.movabilityLayer.visible = false;
    // self.dirty = true;
  });

  // TODO: garbage collection (listeners)
  // TODO: garbage collection (things to render)
}
util.inherits(RangeRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;
    var self = this;


    this.map.eachTile(function(tile, i, j) {
      if ((self.range.grid !== null) && (self.range.grid[j][i])) {
        self.movableTileMap.putTile(self.tileToPhaserTileIndex['movingVisual'], i, j);
        self.movableTileMap.getTile(i, j).alpha = 0.5;
      } else {
        self.movableTileMap.putTile(null, i, j);
      }
    });

  };
};