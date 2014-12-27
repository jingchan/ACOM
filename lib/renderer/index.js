/**
 * ## Renderer
 * - Wraps Phaser rendering functionality
 * - Listens to scene for changes in map objects and visual components
 * - Takes and manages renderObjects
 */

'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var Phaser = require('phaser');
var util = require('util');

var initializePhaser = require('./initializePhaser');

var exports = module.exports = CreateRenderer;

var MapRenderObject = require('./renderObject/mapRenderObject');

var VisualComponentRenderObject = require('./renderObject/visualComponentRenderObject');
var HealthRenderObject = require('./renderObject/healthRenderObject');
var TeamRenderObject = require('./renderObject/teamRenderObject');

/**
 * Constructor for Renderer object
 * @param {Scene} scene Scene to be rendered
 */
function CreateRenderer(app, scene, viewx, viewy, tileSize, gameDiv, completionHandler){
	EventEmitter.call(this);

	this.app = app;
	this.scene = scene;
	this.game = initializePhaser(this, viewx, viewy, tileSize, gameDiv, completionHandler);
	this.viewport = [viewx, viewy];
  this.tileSize = tileSize;

	this.renderObjects = [];


  // ## ADDING LISTENERS

  var that = this;

  // TODO: Re-add initial scene creation
  // Entities, maps, etc that already exist in Scene will not be rendered
  // TODO: Components added/removed from existing entity are not properly handled

	// Listen to scene for entity changes
	scene.on('entityAdded', function(entity){
    that.addEntity(entity);
	});

	scene.on('entityWillBeRemoved', function(entity){
		var visual = entity.getComponent('visual');
		if (visual && visual.renderObject) {
			that.removeRenderObject(visual.renderObject);
      visual.renderObject = null;
		}
	});

	// Listen to scene for map changes
	scene.on('mapAdded', function(map){
    var mapRenderObject = new MapRenderObject(that, map);
    that.addRenderObject(mapRenderObject, that.mapLayer);
    scene.on('readyToGo', function(actor){
      var entity = actor.owner;
      var visibleTiles = scene.map.visibleTiles(
        entity.position.x,
        entity.position.y,
        actor.sightRange);
      mapRenderObject.applyVisibilityMask(visibleTiles);
    });
    // Hold onto ro for cleanup
    map.renderObject = mapRenderObject;
	});

	scene.on('mapWillBeRemoved', function(map){
		if(map && map.renderObject){
      that.removeRenderObject(map.renderObject);
      map.renderObject = null;
    }
	});

}
util.inherits(CreateRenderer, EventEmitter);

exports.prototype.addRenderObject = function(renderObject, layer){
  if(typeof layer === 'undefined'){
    layer = this.entityLayer;
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

exports.prototype.addEntity = function(entity){
  var that = this;
  var game = this.game;

  entity.display = this.game.add.group(this.entityLayer);

  entity.display.position = that._screenCoordFromGridCoord(entity.position.x, entity.position.y);
  entity.on('changed', function(entity){
    entity.display.position = that._screenCoordFromGridCoord(entity.position.x, entity.position.y);
  });
  entity.on('destroy', function(){
    // TODO: Destroy all RenderObjects
    if(entity.display){
      entity.display.removeAll();
    }
  });

  // we create the sprite with the entity's visual component, if it has one
  var visual = entity.getComponent('visual');
  if (visual) {
    var visualRenderObject = new VisualComponentRenderObject(this, visual);
    this.addRenderObject(visualRenderObject, entity.display);

    // hold onto ro in the visual
    visual.renderObject = visualRenderObject;


    // ## ADDING ANIMATION HANDLERS
    // TODO: This part should be split up into pieces similar to RenderObjects
    // no need to tell cursors how to deal with attacking.
    var actComp = entity.getComponent('actor');
    if (actComp) {
      entity.on('successAttack', function(data) {
        var source = that._screenCoordFromGridCoord(data.x1, data.y1);
        var target = that._screenCoordFromGridCoord(data.x2, data.y2);
        var dist = Phaser.Math.distance(source.x,
                                        source.y,
                                        target.x,
                                        target.y)/(that.tileSize * that.tileSize);
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
          var source = that._screenCoordFromGridCoord(data.x1, data.y1);
          var target = that._screenCoordFromGridCoord(data.x2, data.y2);
          var dist = Phaser.Math.distance(source.x,
                                          source.y,
                                          target.x,
                                          target.y)/(that.tileSize * that.tileSize);
          var moveSpeed = visual.opts.moveSpeed || 10;
          game.add.tween(entity.display).to({x:target.x, y:target.y},
                                            1000*dist/moveSpeed).start();
        }
      });
    }


  }

  var teamComp = entity.getComponent('team');
  if(teamComp){
    var teamRenderObject = new TeamRenderObject(this, teamComp);
    this.addRenderObject(teamRenderObject, entity.display);
  }

  var healthComp = entity.getComponent('health');
  if (healthComp) {
    var healthRenderObject = new HealthRenderObject(this, healthComp);
    this.addRenderObject(healthRenderObject, entity.display);

    entity.on("damage", function(data) {
      var damageText = game.loadedSprites['damageText'];
      var target = that._screenCoordFromGridCoord(entity.position.x,
                                            entity.position.y);
      damageText.setText(data.damage.toString());
      damageText.position = target;
      damageText.alpha = 1;
      game.add.tween(damageText).to({y: target.y - 40}, 500)
          .to({y:target.y}, 500)
          .to({y:target.y}, 500)
          .to({alpha:0}, 400)
          .start();
    });

    // we certainly don't want cursors to explode
    entity.on("destroy", function(data) {
      var target = that._screenCoordFromGridCoord(entity.position.x, entity.position.y);
      var explosion = game.loadedSprites['explosion'];
      explosion.reset(target.x, target.y-40, 'explosion');
      explosion.play('boom', 15, false, true);
    });
  }
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

exports.prototype._screenCoordFromGridCoord = function(x, y) {
  return new Phaser.Point((x + 0.5) * this.tileSize, (y + 0.5) * this.tileSize);
};
