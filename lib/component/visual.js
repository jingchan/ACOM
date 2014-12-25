/**
 * Visual Component - Base object for visual components
 */

'use strict';

var Component = require('./base');
var util = require('util');
var _ = require('underscore');

var exports = module.exports = VisualComponent;

/**
 * VisualComponent constructor
 * @param {Object} opts Options for visual
 */
function VisualComponent(opts){
  if(typeof opts === 'undefined') opts = {};
  Component.call(this, opts);

  if(typeof opts.alpha !== 'undefined'){
    this.alpha = opts.alpha;
  }

  if(typeof opts.anchor !== 'undefined'){
    /** 
     * @type {Point} Anchors
     * Defaults to 0.5, 0.5
     */
    this.anchor = opts.anchor;
  }

  if(typeof opts.offset !== 'undefined'){
    /** 
     * @type {Point} pixel offset 
     * Defaults to 0,0
     */
    this.offset = opts.offset;
  }

}

util.inherits(VisualComponent, Component);

exports.prototype.name = 'visual';
