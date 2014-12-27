/**
 * ## SensoryComponent RenderObject
 */

'use strict';

var Debug = require('../../debug');

var RenderObject = require('./index');
var util = require('util');

var exports = module.exports = SensoryComponentRenderObject;

/**
 * Constructor
 */
function SensoryComponentRenderObject(renderer, sensory){
  RenderObject.call(this, renderer);

  this.map = sensory.owner.scene.map;
  this.sensory = sensory;

  var tileSize = this.renderer.tileSize;
  var game = this.renderer.game;

  this.visibleTileMap = game.add.tilemap(null, tileSize, tileSize);
  this.visibilityLayer = this.visibleTileMap.create('visibilityLayer-' + sensory.owner.name,
                             this.map.width, this.map.height,
                             tileSize, tileSize,
                             renderer.fowLayer);

  // visibility_tiles is a janky little tileset with a single image
  // of a blocked-out vision
  this.visibleTileMap.addTilesetImage('visibility_tiles');
  this.tileToPhaserTileIndex = {'blockingVisual': 0};
  var self = this;
  this.map.eachTile(function(tile, i, j){
    // right now, this just puts a "wall"-looking visual at every
    // tile, which is index 0 because it is the first (and only)
    // image in the tileSet.
    self.visibleTileMap.putTile(self.tileToPhaserTileIndex['blockingVisual'], i, j);
    // start off visible! (Which means we put the blocker's alpha
    // on 0
    self.visibleTileMap.getTile(i,j).alpha = 0;
  });

  // this tells us if the agent is currently "thinking." important
  // for the renderObject to know since someone else's FOW doesn't
  // apply to my FOW...
  this.visibilityLayer.visible = false;

  this.sensory.on('takingSensoryPOV', function() {
    Debug.log("Looking through HUD of", self.sensory.owner.name);
    self.visibilityLayer.visible = true;
    self.dirty = true;
  });
  this.sensory.on('removingSensoryPOV', function() {
    Debug.log("No longer through HUD of", self.sensory.owner.name);
    self.visibilityLayer.visible = false;
    self.dirty = true;
  });

}
util.inherits(SensoryComponentRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;
    var self = this;
    this.map.eachTile(function(tile, i, j) {
      if ((self.sensory.visibilityMask !== null) &&
          (self.sensory.visibilityMask[j][i] === false)) {
        self.visibleTileMap.getTile(i,j).alpha = 0.5;
      } else {
        self.visibleTileMap.getTile(i,j).alpha = 0;
      }
    });
  };
};