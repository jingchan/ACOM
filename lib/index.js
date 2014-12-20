/**
 * Creates game application
 */

'use strict';

var Debug = require('./debug');
var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var SceneManager = require('./scene/sceneManager');

//var BaseEntity = require('./entity/base');
var Agent = require('./entity/agent');
var Dragger = require('./devHelper');
var Bullet = require('./entity/bullet');
var Cursor = require('./entity/cursor');

var MenuItem = require('./interface/menuItem');
var Menu = require('./interface/menu');
var MenuRenderObject = require('./renderer/menuRenderObject');

var KeyboardControllerComponent = require('./component/keyboardController');
var keypress = require('keypress').keypress;
var MovementComponent = require('./component/movement');
var Actor = require('./component/actor');
var Visual = require('./component/visual');

// var Phaser = require('phaser');

var exports = module.exports = CreateApplication;

function CreateApplication(){
  var app = {
    // Setup intial state of app
    initialize: function(viewx, viewy, tileSize, gameDiv){

      this.listener = new keypress.Listener();

      // the Scene contains all internal logic to the game, so it is the M in MVC
      this.scene = new Scene();

      // the Renderer is the View in MVC. It should include the
      // phaser Game object, since we are using Phaser as a renderer.
      this.renderer = new Renderer(this, this.scene, viewx, viewy, tileSize, gameDiv);
    },


    postRendererCreation: function () {
        this.map = new Map(20, 14);
        this.scene.addMap(this.map);

        // TODO: Entity construction needs to be abstracted (perhaps as a factory)

        // TODO: replace with an array of players
        this.agents = [];
        this.agents.push(this.makeAgent(this.map, 5, 5, 'edgar',
                                        {animated:true, group:true}));
        this.agents.push(this.makeAgent(this.map, 1, 1, 'monkey',
                                        {group:true}));
        this.agents.push(this.makeAgent(this.map, 10, 10, 'xcom-soldier',
                                        {group:true}));
        this.player = this.agents[0];

        // TODO: use Dragger/devHelper to populate players easily.
        // var dragger1 = new Dragger(this, 'randi.png', 1*40, 15*40);
        // var dragger2 = new Dragger(this, 'xcom-soldier.png', 3*40, 15*40);
        // var dragger3 = new Dragger(this, 'vivi-trans.png', 5*40, 15*40);
        // var dragger4 = new Dragger(this, 'monkey.png', 7*40, 15*40);

        // Initializer cursor
        this.cursor = new Cursor(2, 2);
        this.cursor.addComponent(new Visual(this.renderer, 'cursor', {}));
        this.scene.addEntity(this.cursor);
        this.cursor.addComponent(new KeyboardControllerComponent(this.listener));
        this.cursor.addComponent(new MovementComponent());

        this._registerKeyboardHandlers();

        var sceneManager = this.sceneManager = new SceneManager(this.scene);

        // TODO: can you comment this? I still don't know what this does
        var count = 10;
        var fn = function(){
          sceneManager.allActorsGo(function(){
            Debug.log('finished');

            // temp: prevent infinite locking loop
            count--;
            if(count>0)
              fn();
          });
        };

      fn();

    },

    makeAgent: function(map, gx, gy, spriteHandle, visualOpts) {
      if (0 <= gx && gx <= map.width && 0 <= gy && gy <= map.width) {
        var agent = new Agent(gx, gy);
        agent.addComponent(new Visual(this.renderer, spriteHandle, visualOpts));
        this.scene.addEntity(agent);
        agent.addComponent(new MovementComponent({collision: true}));
        agent.addComponent(new Actor(this, this.scene));
        return agent;
      }
      return null;
    },

    // Setup keypress and add basic keyboard handlers
    // TODO: this should be moved somewhere else
    _registerKeyboardHandlers: function(){
      var self = this;
      var actor = self.player.getComponent('actor');
      this.listener.simple_combo('l', function(){
        Debug.log("Checkup! app object sent to console.");
        Debug.log('# entities', JSON.stringify(self.scene.entities.length));
        // TODO: give me a better practice if you want. This is so I can introspect
        // the elements in realtime.
        console.log("Checkup!");
        console.log(self);
      });

      // TODO: this should be added dynamically with a menu
      this.listener.simple_combo('w', function(){
        if (actor.menu && actor.menu.acceptingInput) {
          actor.menu.moveUp();
        }
      });
      this.listener.simple_combo('s', function(){
        if (actor.menu && actor.menu.acceptingInput) {
          actor.menu.moveDown();
        }
      });
      this.listener.simple_combo('space', function(){
        if (actor.menu && actor.menu.acceptingInput) {
          // this means the menu is on right now, so the player just made
          // a selection
          actor.menu.selectCurrent();
          actor.menu.hide();
          // give control back to the cursor
          self.cursor.getComponent("keyboardController").acceptingInput = true;
        }
        else {
          // this means we pressed space and we aren't already on the menu, so
          // we should show the menu but also reorient it to the cursor

          // TODO: dynamically generate menu.
          // (for now, actor will always have a menu at this point
          //  and it isn't unclear that this is bad)

          // TODO: the pattern here seems to be that "control" went from curor
          // to the menu. Should eventually just have a controller that
          // decides who gets what (ControlSargeant)
          self.cursor.getComponent("keyboardController").acceptingInput = false;
          // TODO: tilePosition is important both for knowing where to
          // put the Menu, but also the associated data of movement.
          actor.menu.tilePosition = {x:self.cursor.position.x,
                                     y:self.cursor.position.y};
          actor.menu.show();
        }
      });

    }
  };

  return app;
}
