/**
 * ## Debug
 * Debugging functions
 */

'use strict';

var $ = require('jquery');

var exports = module.exports = {};

exports.log = function(title){
  var newDiv = document.createElement('div');
  var newText = '<b>' + title + ':</b>  ';
  for (var i = 1; i < arguments.length; i++) {
    newText += arguments[i] + '<br>';
  }
  newDiv.innerHTML = newText;

  var debugDiv = $('#debug');
  debugDiv.append(newDiv);

  // Scroll to bottom
  debugDiv.prop({ scrollTop: debugDiv.prop('scrollHeight') - debugDiv.height() });

};
