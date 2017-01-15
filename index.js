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

	var _fs = __webpack_require__(1);

	var _fs2 = _interopRequireDefault(_fs);

	var _Command = __webpack_require__(2);

	var _Command2 = _interopRequireDefault(_Command);

	var _logger = __webpack_require__(4);

	var _logger2 = _interopRequireDefault(_logger);

	var _dockerfile = __webpack_require__(5);

	__webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	// required for async/await to work


	var main = function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.prev = 0;
	            _context.next = 3;
	            return buildMeteorApp();

	          case 3:
	            _context.next = 5;
	            return createDockerfile();

	          case 5:
	            _context.next = 7;
	            return deployMeteorApp();

	          case 7:
	            _context.next = 13;
	            break;

	          case 9:
	            _context.prev = 9;
	            _context.t0 = _context['catch'](0);

	            console.error(_context.t0);
	            // exit node process with error
	            process.exit(1);

	          case 13:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _callee, undefined, [[0, 9]]);
	  }));

	  return function main() {
	    return _ref.apply(this, arguments);
	  };
	}();

	var buildMeteorApp = function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
	    var buildCommand;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            buildCommand = new _Command2.default('meteor build .meteor/local/builds');

	            (0, _logger2.default)('building meteor app...');
	            _context2.next = 4;
	            return buildCommand.run();

	          case 4:
	            (0, _logger2.default)('done building...');

	          case 5:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, undefined);
	  }));

	  return function buildMeteorApp() {
	    return _ref2.apply(this, arguments);
	  };
	}();

	var createDockerfile = function () {
	  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
	    var dockerfileContents;
	    return regeneratorRuntime.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            dockerfileContents = _dockerfile.dockerfile.getContents();

	            (0, _logger2.default)('creating Dockerfile...');
	            new Promise(function (resolve, reject) {
	              _fs2.default.writeFile('.meteor/local/builds/Dockerfile', dockerfileContents, function (err) {
	                if (err) {
	                  reject(err);
	                }
	                (0, _logger2.default)('done creating Dockerfile...');
	                resolve();
	              });
	            });

	          case 3:
	          case 'end':
	            return _context3.stop();
	        }
	      }
	    }, _callee3, undefined);
	  }));

	  return function createDockerfile() {
	    return _ref3.apply(this, arguments);
	  };
	}();

	var deployMeteorApp = function () {
	  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
	    var args, deployCommand;
	    return regeneratorRuntime.wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            args = process.argv.slice(2).join(' ');
	            deployCommand = new _Command2.default('cd .meteor/local/builds && now ' + args);

	            (0, _logger2.default)('deploying using now service...');
	            _context4.next = 5;
	            return deployCommand.run();

	          case 5:
	            (0, _logger2.default)('done deploying...');

	          case 6:
	          case 'end':
	            return _context4.stop();
	        }
	      }
	    }, _callee4, undefined);
	  }));

	  return function deployMeteorApp() {
	    return _ref4.apply(this, arguments);
	  };
	}();

	main();

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promiseSpawner = __webpack_require__(3);

	var _promiseSpawner2 = _interopRequireDefault(_promiseSpawner);

	var _logger = __webpack_require__(4);

	var _logger2 = _interopRequireDefault(_logger);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Command = function Command(command) {
	  var _this = this;

	  _classCallCheck(this, Command);

	  this.run = function () {
	    (0, _logger2.default)('running command: ' + _this.command);
	    return _this.spawner.spawn(_this.command);
	  };

	  this.command = command;
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
/* 3 */
/***/ function(module, exports) {

	module.exports = require("promise-spawner");

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (msg) {
	  console.log("[METEOR-NOW] - " + msg);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var builddir = 'dirty-mine'; //TODO:
	var buildzip = builddir + '.tar.gz';

	var Dockerfile = function Dockerfile() {
	  var _this = this;

	  _classCallCheck(this, Dockerfile);

	  this.getContents = function () {
	    return '\n      FROM ' + _this.dockerImage + '\n      ADD ' + buildzip + ' .\n      WORKDIR "bundle/programs/server"\n      RUN npm install\n      WORKDIR "../../"\n      EXPOSE 80\n      CMD ["node", "main.js"]\n    ';
	  };

	  // Meteor 1.3.x and earlier
	  this.dockerImage = 'nodesource/jessie:0.10.43';
	};

	var dockerfile = exports.dockerfile = new Dockerfile();

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ }
/******/ ])));