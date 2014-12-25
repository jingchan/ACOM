/**
 * ## VisualComponent RenderObject
 * - Renders a visualComponent
 */

'use strict';

var Debug = require('../debug');
var RenderObject = require('./renderObject');
var util = require('util');

var exports = module.exports = VisualComponentRenderObject;

/**
 * Constructor for VisualComponentRenderObject
 */
function VisualComponentRenderObject(renderer, visual){
  RenderObject.call(this, renderer);

  this.visual = visual;

  // Style parameters

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  // TODO: Listen to map for changes and updated accordingly
  // map.on('event', function(){
  // });
}
util.inherits(VisualComponentRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    if(this.visual.type === 'phaserSprite')
    {
      this._addPhaserSprite();
    }
  }
};

exports.prototype._addPhaserSprite = function (){

};
