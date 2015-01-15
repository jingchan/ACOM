/**
 * ## Base AI object
 *
 * An AI is something that makes decisions.
 *
 * In this game, it seems AI's are equivalent to teams, but this
 * is not set in stone.
 *
 */

'use strict';

var Cursor = require('../entity/cursor');
var BoxVisual = require('../component/boxVisual');
var MovementComponent = require('../component/movement');

var exports = module.exports = AI;

/* An AI eats a situation and returns an action via the makeAction method.
 */
function AI(actor, type) {
  this.type = type;
  this.actor = actor;
  if (this.type == 'human') {
    this.makeAction = this.makeHumanAction;
  } else if (this.type == 'comp') {
    this.makeAction = this.makeHumanAction;
  };
}

exports.prototype.makeHumanAction = function(situation, done) {

  var sceneManager = situation.sceneManager;
  var playerEntity = this.actor.owner;
  var menu = this.actor.menu;
  // Initialize cursor
  var cursor = new Cursor('menuCursor', playerEntity.position.x, playerEntity.position.y);
  cursor.addComponent(new MovementComponent());
  cursor.addComponent(new BoxVisual(0xff0000, {alpha: 0.7, moveSpeed: 10}));
  situation.scene.addEntity(cursor);

  var cursorListener = sceneManager.cursorListener;
  var menuListener = sceneManager.menuListener;
  var inputMode = 'cursor';

  var listenerData = [{key:'a', x: -1, y: 0},
                      {key:'d', x: 1, y: 0},
                      {key:'w', x: 0, y: -1},
                      {key:'s', x: 0, y: 1}];

  listenerData.forEach(function(entry) {
    cursorListener.simple_combo(entry.key, function(){
      if(inputMode === 'cursor'){
        cursor.event('tryMove', {x1: cursor.position.x,
                              y1: cursor.position.y,
                              x2: entry.x + cursor.position.x,
                              y2: entry.y + cursor.position.y});
      }
    });
  });

  menuListener.simple_combo('w', function(){
    if (inputMode === 'menu'){
      menu.moveUp();
    }
  });
  menuListener.simple_combo('s', function(){
    if (inputMode === 'menu'){
      menu.moveDown();
    }
  });
  menuListener.simple_combo('space', function(){
    if (inputMode === 'menu'){
      // this means the menu is on right now, so the player just made
      // a selection
      menu.selectCurrent();
      menu.hide();
      menuListener.reset();

      playerEntity.emit("endTurn", null);
      done();
    }
    else {
      // this means we pressed space and we aren't already on the menu, so
      // we should show the menu but also reorient it to the cursor
      inputMode = 'menu';

      // tilePosition is important both for knowing where to
      // put the Menu, but also the associated data of movement.
      menu.tilePosition = {x:cursor.position.x,
                           y:cursor.position.y};
      cursorListener.reset();
      cursor.destroy();
      menu.show();
    }
  });

};


exports.prototype.makeCompAction = function(situation) {

};
