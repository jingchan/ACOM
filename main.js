/**
 * Creates game instance and adds to html
 */

'use strict';
var $ = require('jquery');
var config = require('./lib/config');

// start app
var app = require('./lib')();
app.initialize('gameDiv');

if(config.debug){
	$('.debug_container').css('visibility', 'visible');
}