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

var Agent = require('./entity/agent');
// var Dragger = require('./devHelper');

var keypress = require('keypress').keypress;
var MovementComponent = require('./component/movement');
var ActorComponent = require('./component/actor');
var HealthComponent = require('./component/health');
var ImageVisualComponent = require('./component/imageVisual');
var PhaserSpriteVisualComponent = require('./component/phaserSpriteVisual');
var TeamComponent = require('./component/team');

var exports = module.exports = CreateApplication;

function CreateApplication(){
  var app = {
    // Setup intial state of app
    initialize: function(gameDiv){

      // the Scene contains the current state of the game, it belongs to the M
      this.scene = new Scene();

      // the Renderer belongs to the V in MVC. It will also create a Phaser.Game object
      this.renderer = new Renderer(
        this,
        this.scene,
        config.renderer.viewSize[0],
        config.renderer.viewSize[1],
        config.renderer.tileSize,
        gameDiv,
        function(){
          app.postRendererCreation();
        }
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
      this.agents.push(this.makeAgent('good', r(1,18), r(1,12), 'edgar', {
        animated:true,
        moveSpeed:1,
        acts:[{name:'Chainsaw (r:1)', event:'tryAttack', data:{damage:70, range:1, renderKey:'bunnyBullet'}}],
        offset: [0, -5]
      }));
      this.agents.push(this.makeAgent('evil', r(1,18), r(1,12), 'xcom-soldier',
                                      {moveSpeed:1,
                                       health:200}));
      this.agents.push(this.makeAgent('good', r(1,18), r(1,12), 'monkey',
                                      {moveSpeed:2}));
      this.agents.push(this.makeAgent('evil', r(1,18), r(1,12), 'randi',
        {moveSpeed:1,
         acts:[{name:'Vanessa Fist (r:10)', event:'tryAttack',
                data:{damage:50,
                      range:10,
                      attackType:'flame',
                      renderKey:'vanessaFist'}}]}));
      this.player = this.agents[0];

      // TODO: use Dragger/devHelper to populate players easily.
      // var dragger1 = new Dragger(this, 'randi.png', 1*40, 15*40);
      // var dragger2 = new Dragger(this, 'xcom-soldier.png', 3*40, 15*40);

      this.debugListener = new keypress.Listener();

      this._registerDebugKeyboardHandlers();

      var sceneManager = this.sceneManager = new SceneManager(this.scene,
                                                              this.renderer);


      var bunny = new Agent('Jing', 'good', r(1,18), r(1,12));
      bunny.addComponent(new ImageVisualComponent('bunny.png'));
      bunny.addComponent(new MovementComponent({collision: true}));
      bunny.addComponent(new HealthComponent(40));
      bunny.addComponent(new ActorComponent([{name:'Move', event:'tryMove', data:{}}]));

      this.scene.addEntity(bunny);

      // do-loop pattern for asynchronous programming
      var fn = function(){
        sceneManager.allActorsGo(function(){
          Debug.log('Actor Finished');
          fn();
        });
      };

      fn();

    },

    makeAgent: function(team, gx, gy, spriteHandle, opts) {
      var map = this.map;
      if (0 <= gx && gx <= map.width && 0 <= gy && gy <= map.width) {
        var index = this.scene.entities.length;
        var agent = new Agent(spriteHandle + index.toString(), gx, gy);
        // we need health first before rendering... this seems to be shaky. Look up
        // good pattern for dealing with dependency stuff like this?
        agent.addComponent(new HealthComponent(opts.health));
        agent.addComponent(new PhaserSpriteVisualComponent(spriteHandle, opts));
        agent.addComponent(new MovementComponent({collision: true}));
        agent.addComponent(new TeamComponent(team));

        var acts = [{name:'Move', event:'tryMove', data:{}},
                    {name:'Attack (r:5)', event:'tryAttack',
                     data:{damage:10,
                           range:9,
                           renderKey:'bunnyBullet'}},
                    {name:'Do Nothing', event:'doNothing', data:{}}];
        if (opts.hasOwnProperty('acts')) {
          acts = acts.concat(opts.acts);
        }
        agent.addComponent(new ActorComponent(acts));

        // it may be good to make it a hard assumption that all components are put
        // on an entity before it enters the scene (since we probably want the
        // scene to add listeners, etc.)
        this.scene.addEntity(agent);
        return agent;
      }
      return null;
    },

    // Setup debug-related keyboard handlers
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

    }

  };

  return app;
}
