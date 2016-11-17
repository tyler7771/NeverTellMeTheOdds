/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Board = __webpack_require__(2);
	const Ship = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasElement = document.getElementsByTagName("canvas")[0];
	  canvasElement.width = Game.DIMENSION_X;
	  canvasElement.height = Game.DIMENSION_Y;
	
	  const context = canvasElement.getContext("2d");
	  const game = new Game();
	  const board = new Board(game, context).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(4);
	const Ship = __webpack_require__(5);
	
	class Game {
	  constructor(options = {}) {
	    this.obstacles = [new Obstacle({ game: this, velocity: [0, 0] })];
	    this.ship = [];
	    this.score = 0;
	    this.topScore = options.topScore || 0;
	
	    this.crash = false;
	    this.playing = false;
	  }
	
	  draw(context) {
	    const background = new Image();
	    background.src = 'http://res.cloudinary.com/dfmvfna21/image/upload/v1479224549/maxresdefault_lpdks4.jpg';
	
	    context.clearRect(0, 0, Game.DIMENSION_X, Game.DIMENSION_Y);
	    background.onload = function(){
	      const pattern = context.createPattern(this, "repeat");
	      context.fillStyle = pattern;
	    };
	    context.fillRect(0, 0, Game.DIMENSION_X, Game.DIMENSION_Y);
	
	    context.font = "30px Sans-serif";
	    context.strokeStyle = 'white';
	    context.lineWidth = 2;
	    context.strokeText(`Current Score: ${this.score}`, 10, 30);
	    context.fillStyle = 'black';
	    context.fillText(`Current Score: ${this.score}`, 10, 30);
	
	    context.font = "30px Sans-serif";
	    context.strokeStyle = 'white';
	    context.lineWidth = 2;
	    context.strokeText(`Top Score: ${this.topScore}`, 775, 30);
	    context.fillStyle = 'black';
	    context.fillText(`Top Score: ${this.topScore}`, 775, 30);
	
	    this.allObjects().forEach((object) => {
	      object.draw(context);
	    });
	  }
	
	  add(object) {
	    if (object instanceof Obstacle) {
	      this.obstacles.push(object);
	    } else if (object instanceof Ship) {
	      this.ship.push(object);
	    }
	  }
	
	  addObstacle(vel) {
	    if (this.obstacles.length === 0 ||
	        this.obstacles[(this.obstacles.length - 1)].pos[0] < 500 &&
	        this.obstacles[(this.obstacles.length - 1)].pos[0] > 496) {
	      this.add(new Obstacle({ game: this }));
	    }
	  }
	
	  addShip() {
	    const ship = new Ship({ game: this });
	    this.add(ship);
	    return ship;
	  }
	
	  removeObstacle() {
	    if (this.obstacles.length > 0 && this.obstacles[0].pos[0] < -50) {
	      this.obstacles.shift();
	    }
	  }
	
	  allObjects() {
	    return [].concat(this.obstacles, this.ship);
	  }
	
	  moveObjects(delta) {
	    this.allObjects().forEach((object) => {
	      object.move(delta);
	    });
	  }
	
	  step(time) {
	    this.moveObjects(time);
	    const crash = this.checkCrash();
	
	    if (crash) {
	      this.crash = true;
	    } else {
	      this.addObstacle();
	      this.removeObstacle();
	      if (this.playing) {
	        this.score += 1;
	      }
	    }
	  }
	
	  checkCrash() {
	    const ship = this.ship[0];
	    let returnValue = false;
	
	    this.obstacles.forEach((obstacle) => {
	      if (obstacle.pos[0] > 249 && obstacle.pos[0] < 451) {
	        if (ship.pos[1] > obstacle.pos[1]
	          && (ship.pos[1] + 100) < (obstacle.pos[1] + 150)) {
	            returnValue = true;
	        } else if ((ship.pos[1] < obstacle.pos[1])
	          && (ship.pos[1] + 100) > (obstacle.pos[1])) {
	            returnValue = true;
	        } else if ((ship.pos[1] < (obstacle.pos[1] + 150))
	          && (ship.pos[1] + 100) > (obstacle.pos[1] + 150)) {
	            returnValue = true;
	        }
	      } else if (ship.pos[1] <= 0 || ship.pos[1] >= 400){
	        returnValue = true;
	      }
	    });
	    return returnValue;
	  }
	
	  randomPosition() {
	    return [
	      999,
	      350 * Math.random()
	    ];
	  }
	}
	
	Game.DIMENSION_X = 1000;
	Game.DIMENSION_Y = 500;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
	class Board {
	  constructor(game, context) {
	    this.game = game;
	    this.context = context;
	  }
	
	  handleStart() {
	    this.game.obstacles.shift();
	    this.game.playing = true;
	  }
	
	  start() {
	    this.game.addShip();
	    this.lastTime = 0;
	
	    requestAnimationFrame(this.animate.bind(this));
	    document.addEventListener("click", () => {this.handleStart();});
	  }
	
	  animate(time) {
	    const timeDelta = time - this.lastTime;
	    const game = this.game;
	
	    game.step(timeDelta);
	    game.draw(this.context);
	
	    this.lastTime = time;
	
	    if (game.crash) {
	      if (game.score > game.topScore) {
	        const score = game.score;
	        this.game = new Game({ topScore: score });
	      } else {
	        const score = game.topScore;
	        this.game = new Game({ topScore: score });
	      }
	      this.start();
	    } else {
	      requestAnimationFrame(this.animate.bind(this));
	    }
	  }
	}
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.velocity = options.velocity;
	    this.size = options.size;
	    this.image = options.image;
	  }
	
	  draw(context) {
	    const img = document.getElementById(`${this.image}`);
	    context.drawImage(img, this.pos[0], this.pos[1], this.size[0], this.size[1]);
	  }
	
	  move(timeDelta) {
	    const scale = timeDelta / NORMAL_TIME_DELTA;
	    const newX = this.velocity[0] * scale;
	    const newY = this.velocity[1] * scale;
	
	    this.pos = [this.pos[0] + newX, this.pos[1] + newY];
	  }
	}
	
	const NORMAL_TIME_DELTA = 1000/60;
	
	module.exports = MovingObject;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	
	class Obstacle extends MovingObject {
	  constructor(options = {}) {
	  	options.image = 'rock';
	    options.pos =  options.pos || options.game.randomPosition();
	    options.size = [50, 150];
	    options.velocity = options.velocity || [-5, 0];
	    super(options);
	  }
	
	}
	
	module.exports = Obstacle;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(3);
	
	class Ship extends MovingObject {
	  constructor(options = {}) {
	  	options.image = 'falcon';
	    options.pos =  [300, 200];
	    options.size = [150, 100];
	    options.velocity = [0, 0];
	    super(options);
	    this.bindEvents();
	  }
	
	  bindEvents() {
	    window.onkeydown = (event) => {
	      if (event.keyCode === 32) {
	        this.movementUp();
	      }
	    };
	
	    window.onkeyup = (event) => {
	      if (event.keyCode === 32) {
	        this.movementDown();
	      }
	    };
	
	    window.onclickdown = (event) => {
	      if (event.keyCode === 32) {
	        this.movementUp();
	      }
	    };
	
	    window.onclickup = (event) => {
	      if (event.keyCode === 32) {
	        this.movementDown();
	      }
	    };
	  }
	
	  movementUp() {
	    this.velocity = [0, -4];
	  }
	
	  movementDown() {
	    this.velocity = [0, 5];
	  }
	}
	
	module.exports = Ship;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map