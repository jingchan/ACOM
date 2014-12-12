/**
 * ## Scene
 * Represents full current game state
 */
'use strict';

module.exports = CreateScene;

function CreateScene(){
	var scene = {
		entities: [],
		map: null
	};

	return scene;
}
