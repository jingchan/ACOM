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
  this.sensory = sensory;

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
    // start off visible! (Which means we put the blocker's alpha
    // on 0
    this.visibleTileMap.getTile(i,j).alpha = 0;
  });

  // this tells us if the agent is currently "thinking." important
  // for the renderObject to know since someone else's FOW doesn't
  // apply to my FOW...
  this.isActiveAgent = false;

  this.sensory.on('takingSensoryPOV', function() {
    this.isActiveAgent = true;
    this.dirty = true;
  });
  this.sensory.on('removingSensoryPOV', function() {
    this.isActiveAgent = false;
    this.dirty = true;
  });

}
util.inherits(SensoryComponentRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;
    var self = this;
    this.map.eachTile(function(tile, i, j) {
      if (this.isActiveAgent &&
          this.sensory.visibilityMask !== null &&
          this.sensory.visibilityMask[j][i] === false) {
        self.visibleTileMap.getTile(i,j).alpha = 1;
      } else {
        self.visibleTileMap.getTile(i,j).alpha = 0;
      }
    });
  };
};