/**
 * ## Team RenderObject
 */

'use strict';

var RenderObject = require('./index');
var util = require('util');

var exports = module.exports = TeamRenderObject;

/**
 * Constructor for VisualComponentRenderObject
 */
function TeamRenderObject(renderer, team){
  RenderObject.call(this, renderer);

  this.team = team;

  // Style parameters

  // Register event listeners
  // TODO: implement cleanup/removal for these handlers
  var that = this;
  // health.on('change', function(){
  //   that.dirty = true;
  // });
}
util.inherits(TeamRenderObject, RenderObject);

exports.prototype.update = function(){
  if(this.dirty){
    this.dirty = false;

    // TODO: Don't need to fully reconstruct every time
    this.display.removeAll();
    
    this._drawTeamIndicator();    
  }
};

var teamData = {
  good: 0xf0ff0f,
  evil: 0xff0000
};

exports.prototype._drawTeamIndicator = function (){
  var game = this.renderer.game;

  var teamName = this.team.teamName;
  var fillColor = teamData[teamName] || 0x000000;

  var teamIndicator = game.add.graphics(Math.floor(-this.renderer.tileSize / 2), Math.floor(this.renderer.tileSize / 2), this.display);
  teamIndicator.lineStyle(1, 0x000000, 1);
  teamIndicator.beginFill(fillColor, 1);
  teamIndicator.drawRect(-5, -5, 10, 10);
};
