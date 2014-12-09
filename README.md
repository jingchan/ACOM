ACOM
====

ACOM


## Install and Build
1. Install Git and Node (and NPM)
2. Install gulp (task runner): `npm install -g gulp`
3. `git clone git@github.com:jingchan/ACOM`
4. `cd ACOM`
5. `npm install`

## Build & Run
1. `gulp`

## Brief explanation of the project structure and outside tools.

1. This is a node.js project, which uses npm as a package manager
2. Pixi.js is a rendering/game engine (Free javascript game engine with decent popularity).
3. Gulp is a task runner (runs small scripts that help with development), its current 'default' action is to copy over the public folder, browserify the project, and start a webserver.  It also reruns this action when changes occur.
 
## TODO

1. Add keyboard input ([keypress](http://dmauro.github.io/Keypress/) seems good)
