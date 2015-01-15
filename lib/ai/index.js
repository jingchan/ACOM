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

var exports = module.exports = AI;

/* An AI eats a situation and returns an action via the makeAction method.
 */
function AI(actor, type) {
  this.type = type;
  this.actor = actor;
  if (this.type == 'human') {
    this.makeAction = this.makeHumanAction;
  } else if (this.type == 'comp') {
    this.makeAction = this.makeCompAction;
  };
}

exports.prototype.makeHumanAction = function(situation) {

};

exports.prototype.makeCompAction = function(situation) {

};
