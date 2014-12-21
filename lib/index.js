/**
 * Creates game application
 */

'use strict';

var config = require('./config');

var Debug = require('./debug');
var Renderer = require('./renderer');
var Scene = require('./scene');
var Map = require('./map');

var SceneManager = require('./scene/sceneManager');

//var BaseEntity = require('./entity/base');
var Agent = require('./entity/agent');
var Dragger = require('./devHelper');
var Bullet = require('./entity/bullet');

var MenuItem = require('./interface/menuItem');
var Menu = require('./interface/menu');
var MenuRenderObject = require('./renderer/menuRenderObject');

var keypress = require('keypress').keypress;
var MovementComponent = require('./component/movement');
var Actor = require('./component/actor');
var Visual = require('./component/visual');

var Phaser = require('phaser');

var exports = module.exports = CreateApplication;

function CreateApplication(){
  var app = {
    // Setup intial state of app
    initialize: function(gameDiv){

      // the Scene contains all internal logic to the game, so it is the M in MVC
      this.scene = new Scene();

      // the Renderer is the View in MVC. It should include the
      // phaser Game object, since we are using Phaser as a renderer.
      this.renderer = new Renderer(
        this, 
        this.scene, 
        config.renderer.viewSize[0], 
        config.renderer.viewSize[1], 
        config.renderer.tileSize, 
        gameDiv
      );
    },

    /*
     * This is the code we run after setting up the game, because we depend
     * on some game objects having been made so we need it to be synchronous.
     * This code is called by a renderer callback after the game preloads
     * and creates sprites, etc. which we will need for anything that needs
     * a visual component, such as the map, or agents.
     */
    postRendererCreation: function () {
      this.map = new Map(20, 14);
      this.scene.addMap(this.map);

      // TODO: Entity construction needs to be abstracted (perhaps as a factory)


      var r = function(small, big) {
        return Math.floor(Math.random() * (big - small + 1)) + small;
      };

      // TODO: replace with an array of players
      this.agents = [];
      this.agents.push(this.makeAgent(this.map, r(1,19), r(1,12), 'edgar',
                                      {animated:true, group:true}));
      this.agents.push(this.makeAgent(this.map, r(1,19), r(1,12), 'monkey',
                                      {group:true}));
      this.agents.push(this.makeAgent(this.map, r(1,19), r(1,12), 'xcom-soldier',
                                      {group:true}));
      this.player = this.agents[0];

      // TODO: use Dragger/devHelper to populate players easily.
      // var dragger1 = new Dragger(this, 'randi.png', 1*40, 15*40);
      // var dragger2 = new Dragger(this, 'xcom-soldier.png', 3*40, 15*40);
      // var dragger3 = new Dragger(this, 'vivi-trans.png', 5*40, 15*40);
      // var dragger4 = new Dragger(this, 'monkey.png', 7*40, 15*40);

      this.menuListener = new keypress.Listener();
      this.cursorListener = new keypress.Listener();
      this.debugListener = new keypress.Listener();

      this._registerDebugKeyboardHandlers();

      var sceneManager = this.sceneManager = new SceneManager(this.scene);

      var fn = function(){
        sceneManager.allActorsGo(function(){
          Debug.log('finished');
          fn();
        });
      };

      fn();

    },

    makeAgent: function(map, gx, gy, spriteHandle, visualOpts) {
      if (0 <= gx && gx <= map.width && 0 <= gy && gy <= map.width) {
        var index = this.scene.entities.length;
        var agent = new Agent(spriteHandle + index.toString(), gx, gy);
        agent.addComponent(new Visual(spriteHandle, visualOpts));
        this.scene.addEntity(agent);
        agent.addComponent(new MovementComponent({collision: true}));
        agent.addComponent(new Actor(this, this.scene));
        return agent;
      }
      return null;
    },

    // Setup keypress and add basic keyboard handlers
    _registerDebugKeyboardHandlers: function(){
      var self = this;
      this.debugListener.simple_combo('l', function(){
        Debug.log("Checkup! app object sent to console.");
        Debug.log('# entities', JSON.stringify(self.scene.entities.length));
        // TODO: give me a better practice if you want.
        // This is so I can introspect elements in realtime.
        console.log("Checkup!");
        console.log(self);
      });

      this.debugListener.simple_combo('h', function() {
        Debug.log("making some sprites");
        var sprite = new Phaser.Sprite(self.renderer.game, 0, 600, 'monkey');
      });

    }

  };

  return app;
}
