/**
 * ## Base strategy object
 *
 * A strategy is something that eats situations and spits out
 * decisions. An AI uses a strategy to find decisions.
 *
 * Example strategies:
 * - humanStrategy - ask human for input. Human gives action.
 * - aggroStrategy - attack relentlessly!
 *
 */

'use strict';

var exports = module.exports = Strategy;

function Strategy(opts) {

}

/*
 * the meat of a strategy object's interface;
 * it takes a situation, a list allowed actions, and spits out
 * an action. Note it gives a move for an AI, not an agent.
 *
 */
exports.prototype.pickAction = function(AI, actionList, situation) {

};