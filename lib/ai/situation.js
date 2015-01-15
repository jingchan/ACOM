/**
 * ## Base Situation object
 *
 * A Situation is something a strategy eats to convert to decisions.
 *
 * Alternative framing: "what is the chessboard I see?"
 *   (imagine a chessboard with a fog of war)
 *
 * # Distinction between Situations and Scenes:
 * Suppose we were playing 2-player poker. Then there are 3 things
 * going on:
 * - the Scene, which is what is "really" happening, including
 *   all the actual cards, bets, etc. (this is usually called
 *   the "game state")
 * - two Situations, which is the information available to the two
 *   players. This includes all of their own actions and the visible
 *   part of the opponents' past actions.
 * In full-information games like Chess and Go, we convert "Scenes"
 * to moves. In hidden-information games, we must convert Situations
 * to moves.
 *
 */

'use strict';

var exports = module.exports = Situation;

/*
 * For now, a situation should simply take a scene
 *
 * Spec of goals, short and long:
 *   We are making a game with incomplete information, so the most
 * complete Situation would be the complete game state
 * (and history) from the perspective of the AI.
 * While this is doable, it seems heavy. For V0, maybe a better
 * way of representing the situation is just a condensed scene
 * visible to the AI (and no histories for now), something like
 * the union of all the visibile tiles. For the future, it may also
 * help to have several different representations of the situation,
 * from very condensed / hashed versions to very full ones for
 * really robust AI that takes into account past actions.
 */

function Situation(scene) {
  // TODO: right now, we just give scene. This is really TMI. Eventually, we should just give the union
  // of all the visible tiles to the AI, as well as all entities on them.

  this.scene = scene;
}
