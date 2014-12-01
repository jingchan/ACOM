ACOM
====

ACOM


## Install and Build
1. Install Git and Node (and NPM)
2. Install browserify: `npm install -g browserify`
3. `git clone git@github.com:jingchan\ACOM`
4. `cd ACOM`
5. `npm install`
6. `browserify main.js > bundle.js`

## Run
1. `npm install -g http-server`
2. `http-server`
3. Open http://localhost:8080


## Brief explanation of the project structure and outside tools.

1. This is a node.js project, which uses npm as a package manager
2. Pixi.js is a rendering/game engine (Free javascript game engine with decent popularity).
3. browserify to "compiles/translates" the node project into a single javascript file (bundle.js) to be consumed in a browser.
