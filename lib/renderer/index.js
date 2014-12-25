/**
 * ## Renderer
 * - Wraps Phaser rendering functionality
 * - Listens to scene for changes in map objects and visual components
 * - Takes and manages renderObjects
 */

'use strict';

var Debug = require('../debug');

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var Phaser = require('phaser');
var util = require('util');

var initializePhaser = require('./initializePhaser');

var exports = module.exports = CreateRenderer;

var MapRenderObject = require('./renderObject/mapRenderObject');
var VisualComponentRenderObject = require('./renderObject/visualComponentRenderObject');

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function CreateRenderer(app, scene, viewx, viewy, tileSize){
	var renderer = Object.create(CreateRenderer.prototype);
	EventEmitter.call(renderer);
	util.inherits(renderer, EventEmitter);

	renderer.app = app;
	renderer.scene = scene;
	var game = renderer.game = initializePhaser(renderer, viewx, viewy, tileSize);
	renderer.tileSize = game.tileSize;

	// grid things are anchored to bottom middle, where feet are
  renderer._screenCoordFromGridCoord = function(x, y) {
    return new Phaser.Point((x + 0.5) * renderer.tileSize,
                        (y + 0.5) * renderer.tileSize);
  }; 
  
	renderer.viewport = game.viewport;

	renderer.renderObjects = [];

  // TODO: Re-add initial scene creation
  // Entities, maps, etc that already exist in Scene will not be rendered
  // TODO: Components added/removed from existing entity are not properly handled

	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
		// we create the sprite with the entity's visual component, if it has one
		var visual = entity.getComponent('visual');
		if (visual) {
      var visualRenderObject = new VisualComponentRenderObject(renderer, visual);
      renderer.addRenderObject(visualRenderObject);

      // hold onto ro in the visual
      visual.renderObject = visualRenderObject;


      // ## ADDING ANIMATION HANDLERS
      // TODO: This part should be split up into pieces similar to RenderObjects
      // no need to tell cursors how to deal with attacking.
      var actComp = entity.getComponent('actor');
      if (actComp) {
        entity.on('successAttack', function(data) {
          var source = renderer._screenCoordFromGridCoord(data.x1, data.y1);
          var target = renderer._screenCoordFromGridCoord(data.x2, data.y2);
          var dist = Phaser.Math.distance(source.x,
                                          source.y,
                                          target.x,
                                          target.y)/(renderer.tileSize * renderer.tileSize);
          if (data.renderKey === 'bunnyBullet') {
            var bullet = game.loadedSprites['bunny'];
            bullet.reset(source.x, source.y);
            bullet.alpha = 1;
            game.add.tween(bullet).to({x:target.x, y:target.y},
                                      800).start();
            game.add.tween(bullet).to({alpha: 0}, 1000).start();
          } else if (data.renderKey === 'vanessaFist') {
            var vanessa = game.loadedSprites['vanessaFist'];
            vanessa.reset(target.x - 200, target.y - 230);
            vanessa.alpha = 1;
            // ('key', frameRate, loop, killOnComplete).
            // I don't kill because I want her to smooth out
            vanessa.animations.play('default', 7, false);
            game.add.tween(vanessa).to({alpha: 0}, 3500).start();
          } else if (data.renderKey === 'chainsaw') {
            // TODO: chainsaw!
          }
        });
      }
      // note you can move without being able to act (cursors, etc.)
      var moveComp = entity.getComponent('movement');
      if (moveComp) {
        entity.on('successMove', function(data) {
          if (data.x1 === data.x2 && data.y1 === data.y2) {
            // stupid bug that involves things moving infinitely far, so don't
            // do anything if the move doesn't change positions
          } else {
            var source = renderer._screenCoordFromGridCoord(data.x1, data.y1);
            var target = renderer._screenCoordFromGridCoord(data.x2, data.y2);
            var dist = Phaser.Math.distance(source.x,
                                            source.y,
                                            target.x,
                                            target.y)/(renderer.tileSize * renderer.tileSize);
            var moveSpeed = visual.opts.moveSpeed || 10;
            game.add.tween(visualRenderObject.display).to({x:target.x, y:target.y},
                                              1000*dist/moveSpeed).start();
          }
        });
      }

      var healthComp = entity.getComponent('healthComponent');
      if (healthComp) {
        // add to the visual.display container a text about the health
        visual.healthText = game.add.text(0, 0, healthComp.health.toString(),
                                          {font: "16px Arial", fill: "#ffffff"},
                                          visual.display);
        entity.on("damage", function(data) {
          var damageText = game.loadedSprites['damageText'];
          var target = renderer._screenCoordFromGridCoord(entity.position.x,
                                                entity.position.y);
          damageText.setText(data.damage.toString());
          damageText.position = target;
          damageText.alpha = 1;
          game.add.tween(damageText).to({y: target.y - 40}, 500)
              .to({y:target.y}, 500)
              .to({y:target.y}, 500)
              .to({alpha:0}, 400)
              .start();
          visual.healthText.setText(healthComp.health.toString());
        });

        // we certainly don't want cursors to explode
        entity.on("destroy", function(data) {
          var target = renderer._screenCoordFromGridCoord(entity.position.x,
                                                entity.position.y);
          var explosion = game.loadedSprites['explosion'];
          explosion.reset(target.x, target.y-40, 'explosion');
          explosion.play('boom', 15, false, true);
        });
      }
		}
	});

	scene.on('entityWillBeRemoved', function(entity){
		var visual = entity.getComponent('visual');
		if (visual && visual.renderObject) {
			renderer.removeRenderObject(visual.renderObject);
      visual.renderObject = null;
		}
	});

	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
    var mapRenderObject = new MapRenderObject(renderer, map);
    renderer.addRenderObject(mapRenderObject, renderer.game.mapLayer);
    
    // Hold onto ro for cleanup
    map.renderObject = mapRenderObject;
	});
	scene.on('mapWillBeRemoved', function(map){
		if(map && map.renderObject){
      renderer.removeRenderObject(map.renderObject);
      map.renderObject = null;
    }
	});

	return renderer;
}

exports.prototype.addRenderObject = function(renderObject, layer){
  if(typeof layer === 'undefined'){
    layer = this.game.entityLayer;
  }

  // Store layer in renderObject so we can easily get it in removeRenderObject
  renderObject.layer = layer;

	this.renderObjects.push(renderObject);
  layer.add(renderObject.display);
};

exports.prototype.removeRenderObject = function(renderObject){
  var layer = renderObject.layer;
  layer.remove(renderObject.display);

	renderObject.renderer = null;
	this.renderObjects = _.reject(this.renderObjects, function(ro){
		return ro === renderObject;
	});
	renderObject.destroy();
};

/**
 * updates viewport to match scene object
 * @param  {Scene}
 */
exports.prototype.update = function(){
	this.renderObjects.forEach(function(ro) {
    ro.update();
	});
};
