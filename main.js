/**
 * Creates game instance and adds to html
 */

'use strict';
var $ = require('jquery');

// start app
var app = require('./lib')();
app.initialize(800, 680, 40, 'gameDiv');
