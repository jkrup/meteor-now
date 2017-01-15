#!/usr/bin/env node
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _command = __webpack_require__(1);

	var _command2 = _interopRequireDefault(_command);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var fs = __webpack_require__(3);

	// var spawn = require('child_process').spawn;

	// var cmd1    = spawn('meteor', ['build', '.meteor/local/builds']);
	var cmd1 = new _command2.default();

	// var exec = require('child_process').exec;

	// var cmd = 'cd .meteor/local/builds;';

	// var cmd2 = 'now -e ROOT_URL=http://example.com -e ';
	var cmd2 = new _command2.default();

	var builddir = 'drp'; //TODO:
	var buildzip = builddir + '.tar.gz';

	// Meteor 1.3.x and earlier
	var dockerfile = '\n    FROM nodesource/jessie:0.10.43\n\n    ADD ' + buildzip + ' .\n\n    WORKDIR "bundle/programs/server"\n\n    RUN npm install\n\n    WORKDIR "../../"\n\n    EXPOSE 80\n\n    CMD ["node", "main.js"]\n';

	cmd1.run('meteor build .meteor/local/builds', 'building meteor app...').then(function (out) {
	  console.log('done with cmd1', out);
	  cmd2.run('cd .meteor/local/builds && now -e ROOT_URL=http://example.com', 'deploying using now service...').then(function (out2) {
	    console.log('done with second...', out2);
	    fs.writeFile('Dockerfile', dockerfile, function (err) {
	      if (err) {
	        throw err;
	      }
	      console.log('It\'s saved!');
	    });
	  });
	});

	var buildzip = 'dirty-mine.tar.gz';

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promiseSpawner = __webpack_require__(2);

	var _promiseSpawner2 = _interopRequireDefault(_promiseSpawner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Command = function Command() {
	  var _this = this;

	  _classCallCheck(this, Command);

	  this.run = function (cmd, msg) {
	    if (msg) {
	      console.log('[METEOR-NOW] -- ' + msg);
	    }
	    return _this.spawner.spawn(cmd);
	  };

	  var modifiers = {
	    out: function out(d) {
	      return d;
	    },
	    err: 'this is an error: '
	  };
	  this.spawner = new _promiseSpawner2.default(modifiers, {
	    stdio: 'inherit'
	  });
	  this.spawner.out.pipe(process.stdout);
	  this.spawner.err.pipe(process.stdout);
	};

	exports.default = Command;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("promise-spawner");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ }
/******/ ])));
