/**
 * Team Component - Entity belongs to a Team
 */

'use strict';

var Component = require('./base');
var util = require('util');

var exports = module.exports = TeamComponent;

/**
 * TeamComponent constructor
 */
function TeamComponent(teamName, opts){
  if(typeof opts === 'undefined'){
    opts = {};
  }
  
  Component.call(this, opts);

  this.teamName = teamName;
}
util.inherits(TeamComponent, Component);

exports.prototype.name = 'team';
