var gameSnake = (function () {
	'use strict';
	//Объявляем переменные
	//Создаём поле
	var canvas = document.getElementById('canvas'),
			ctx = canvas.getContext('2d');
	//Объявляем основные переменные
	var canvSize = 620,
			cellSize = 20,
			font = 15,
			grid = canvSize / cellSize,
			w = canvSize,
			h = w,
			speed = null,
			settedSpeed = speed,
			score = 0,
			highScore = score,
			snakeLength = 8,
			dir = null,
			delay = null,
			dirDelay = delay / 2,
			gameLoop = null,
			currSnake = null,
			food = null,
			boundaries = false,
			withBlocks = true,
			paused = null;
	//Задаём ширину и высоту поля
	canvas.width = w;
	canvas.height = h;
	//Объявляем используемые кнопки и направление змейки
	var KEY = {
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40,
				ESC: 27,
				SPACE: 32
			},
			DIR = {
				UP:'up',
				DOWN:'down',
				LEFT:'left',
				RIGHT:'right',
				//OPPOSITE:['down', 'up', 'right', 'left']
			};
	//Считаем задержку
	function setDelay() {
		delay = 5000 / speed;
	}
	//Задаём масштаб
	/*function scale() {
		canvSize = innerWidth < innerHeight ? innerWidth * 0.95: innerHeight * 0.8;
		cellSize = canvSize / 25; //Делим только на нечетные!!! Иначе центральныйквадратный блок неправильно рисуется.
		font = cellSize / 1.5;
		grid = canvSize / cellSize;
		w = canvSize;
		h = w;
		canvas.width = w;
		canvas.height = h;
	}*/
	//Snake
	//Инициализируем змейку
	function initSnake() {
		currSnake = [];
		for (var i = snakeLength - 1; i >= 0; i--) {
			currSnake.push({x: i + 3, y: 6});
		}
	}
	//Генерируем следующую змейку
	function nextSnake() {
		var head = {
			x: currSnake[0].x, 
			y: currSnake[0].y
		};
		if (dir === DIR.RIGHT) {
			head.x++;
		} else if (dir === DIR.LEFT) {
			head.x--;
		} else if (dir === DIR.UP) {
			head.y--;
		} else if (dir === DIR.DOWN) {
			head.y++;
		}
		for (var i = 0; i < currSnake.length; i++) {
			if (checkCollision (head, currSnake[i])) {
				gameOver();
				return;
			}
		}
		//without boundaries
		//Поле с границами или без
		if (boundaries) {
			if (head.x === grid || head.y === grid || head.x < 0 || head.y < 0) {
				gameOver();
				return;
			}
		} else {
			head.x = (head.x + grid) % grid;
			head.y = (head.y + grid) % grid;
			//Еще одна реализация поля без границ
			/*head.x = (head.x < 0) ? grid - 1 : head.x;
			head.x = (head.x === grid) ? 0 : head.x;
			head.y = (head.y < 0) ? grid - 1 : head.y;
			head.y = (head.y === grid) ? 0 : head.y;*/
		}
		//Если змейка ударяется в преграду заканчиваем игру
		if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var i = 0; i < blockLength; i++) {
					if (checkCollision (head, blocks[a][i])) {
						gameOver();
						return;
					}
				}
			}
			//SquareBlocks
			/*for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var j = 0; j < blockLength; j++) {
					for (var i = 0; i < blockLength; i++) {
						if (checkCollision (head, blocks[a][j][i])) {
							gameOver();
							return;
						}
					}
				}
			}*/
		}
		//Добавляем в начало массива новую голову
		currSnake.unshift(head);
		if (!checkCollision (head, food)) {
			//Если нет коллизии с едой удаляем последний элемент массива(хвост)
			currSnake.pop();
		} else {
			//Если змейка кушает еду, то генерируем новую и увеличиваем скорость игры
			createFood();
			if (delay >= 50) {
				speed += 2;
				setDelay();
				score++;
				if (score > highScore) {
					highScore = score;
				}
			}
			interval();
		}
	}
	//Рисуем змейку
	function drawSnake() {
		//Меняем цвет змейки от головы до хвоста
		var color = 0;
		for (var i = 0; i < currSnake.length; i++) {
			var cell = currSnake[i];
			if (color < 255) {
				color += 5;
			}
			ctx.fillStyle = 'rgba(30,' + color + ',255,1)';
			ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
			ctx.strokeStyle = 'white';
			ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
		}
	}

	//Food
	//Генерируем еду
	function createFood() {
		var rndX = Math.floor(Math.random() * grid);
		var rndY = Math.floor(Math.random() * grid);
		food = {
			x: rndX, 
			y: rndY
		};
		//Если еда появляется в теле змейки генерироруем новую еду
		for (var i = 0; i < currSnake.length; i++) {
			if (checkCollision (food, currSnake[i])) {
				createFood();
			}
		}
		//Если еда появляется в теле преграды генерируем новую еду
		if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var i = 0; i < blockLength; i++) {
					if (checkCollision (food, blocks[a][i])) {
						createFood();
					}
				}
			}
		}
		//SquareBlocks
		/*if (withBlocks) {
			var blocksLength = blocks.length;
			for (var a = 0; a < blocksLength; a++) {
				var blockLength = blocks[a].length;
				for (var j = 0; j < blockLength; j++) {
					for (var i = 0; i < blockLength; i++) {
						if (checkCollision (food, blocks[a][j][i])) {
							createFood();
						}
					}
				}
			}
		}*/
	}
	//Рисуем еду
	function drawFood() {
		ctx.fillStyle = 'rgba(255,0,0,1)';
		ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
		ctx.strokeStyle = 'white';
		ctx.strokeRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
	}
	//Blocks
	//Конструктор для квадратных преград
	/*function SquareBlock(x, y, size) {
		var block = [];
		for (var j = 0; j < size; j++) {
			block[j] = [];
			for (var i = 0; i < size; i++) {
				block[j][i] = {
					x: x + i,
					y: y + j
				};
			}
		}
		return block;
	}*/

	//Конструктор горизональных преград
	function Xblock(x, y, length) {
		var block = [];
		for (var i = 0; i < length; i++) {
			block[i] = {
				x: x + i,
				y: y
			};
		}
		return block;
	}
	//Конструктор вертикальных преград
	function Yblock(x, y, length) {
		var block = [];
		for (var i = 0; i < length; i++) {
			block[i] = {
				x: x,
				y: y + i
			};
		}
		return block;
	}
	//Создаём преграды
	var blocks = [],
			//SquareBlocks
			//blockSize = 2,
			xBlockLength = 3,
			yBlockLength = xBlockLength;
	function createBlocks() {
		if (withBlocks) {
			//SquareBlocks
			/*blocks.push(SquareBlock(2, 2, blockSize));
			blocks.push(SquareBlock(grid - 4, 2, blockSize));
			blocks.push(SquareBlock(2, grid - 4, blockSize));
			blocks.push(SquareBlock(grid - 4, grid - 4, blockSize));
			blocks.push(SquareBlock((grid / 2) - 1, (grid / 2) - 1, blockSize));*/
			//Блоки буквой "Г" по бокам
			blocks.push(Xblock(2, 2, xBlockLength));
			blocks.push(Yblock(2, 2, yBlockLength));
			blocks.push(Xblock(grid - 5, 2, xBlockLength));
			blocks.push(Yblock(grid - 3, 2, yBlockLength));
			blocks.push(Xblock(2, grid - 3, xBlockLength));
			blocks.push(Yblock(2, grid - 5, yBlockLength));
			blocks.push(Xblock(grid - 5, grid - 3, xBlockLength));
			blocks.push(Yblock(grid - 3, grid - 5, yBlockLength));
			//Квадратный блок 3х3 в центре
			blocks.push(Xblock((grid / 2) - 1.5, (grid / 2) - 1.5, xBlockLength));
			blocks.push(Xblock((grid / 2) - 1.5, (grid / 2) - 0.5, xBlockLength));
			blocks.push(Xblock((grid / 2) - 1.5, (grid / 2) + 0.5, xBlockLength));
		}
	}
	//Рисуем преграды
	function drawBlocks(blocks) {
		var blocksLength = blocks.length;
		for (var a = 0; a < blocksLength; a++) {
			var blockLength = blocks[a].length;
			for (var i = 0; i < blockLength; i++) {
				var cell = blocks[a][i];
				ctx.fillStyle = 'black';
				ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
				ctx.strokeStyle = 'white';
				ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
			}
			//SquareBlocks
			/*for (var j = 0; j < blockLength; j++) {
				for (var i = 0; i < blockLength; i++) {
					var cell = blocks[a][j][i];
					ctx.fillStyle = 'black';
					ctx.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
					ctx.strokeStyle = 'white';
					ctx.strokeRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize);
				}
			}*/
		}
	}
	//Drawing
	//Перерисовываем поле, чтобы стереть старый хвост
	function drawCanvas() {
		ctx.fillStyle = 'rgba(0,160,0,1)';
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = 'rgba(0,255,0,1)';
		ctx.lineWidth = 0.2;
		for (var y = 0; y < grid; y++) {
			for (var x = 0; x < grid; x++) {
				ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
		ctx.lineWidth = 1;
	}
	//Рисуем счет
	function drawScore() {
		var scoreText = "Score: " + score,
				highScoreText = "High: " + highScore;
		ctx.fillStyle = 'rgba(255,255,0,1)';
		ctx.font = "bold " + font + "px Arial";
		ctx.globalAlpha = 0.8;
		ctx.fillText(scoreText, w - font * 5, h - font / 2);
		ctx.fillText(highScoreText, w - font * 9, h - font / 2);
		ctx.globalAlpha = 1;
	}
	//Рисуем поле, змейку, блоки, еду и счет
	function draw() {
		drawCanvas();
		drawSnake();
		if (withBlocks) {
			drawBlocks(blocks);
		}
		drawFood();
		drawScore();
	}
	//Управление змейкой клавишами
	function keyBindings(e) {
		//Убираем действие по умолчанию, при нажатии кнопок (прокрутка страницы)
		e.preventDefault();
		var key = e.keyCode;

		switch (key) {
			case KEY.LEFT: if (dir !== DIR.RIGHT) {
				//Предотвращаем одновременное нажатие клавиш
				setTimeout(function () {
					dir = DIR.LEFT;
				}, dirDelay);
				break;
			}
			case KEY.RIGHT: if (dir !== DIR.LEFT) {
				setTimeout(function () {
					dir = DIR.RIGHT;
				}, dirDelay);
				break;
			}
			case KEY.UP: if (dir !== DIR.DOWN) {
				setTimeout(function () {
					dir = DIR.UP;
				}, dirDelay);
				break;
			}
			case KEY.DOWN: if (dir !== DIR.UP) {
				setTimeout(function () {
					dir = DIR.DOWN;
				}, dirDelay);
				break;
			}
			case KEY.ESC:
			case KEY.SPACE: {
				pause();
				break;
			}
		}
	}
	//Добавляем кнопки для девайсов с тач скрином
	var leftBtn = document.querySelector('.left'),
			rightBtn = document.querySelector('.right'),
			upBtn = document.querySelector('.up'),
			downBtn = document.querySelector('.down');
	leftBtn.addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (dir !== DIR.RIGHT) {
				setTimeout(function () {
					dir = DIR.LEFT;
				}, dirDelay);
		}
	});
	rightBtn.addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (dir !== DIR.LEFT) {
				setTimeout(function () {
					dir = DIR.RIGHT;
				}, dirDelay);
		}
	});
	upBtn.addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (dir !== DIR.DOWN) {
				setTimeout(function () {
					dir = DIR.UP;
				}, dirDelay);
		}
	});
	downBtn.addEventListener('mousedown', function (e) {
		e.preventDefault();
		if (dir !== DIR.UP) {
				setTimeout(function () {
					dir = DIR.DOWN;
				}, dirDelay);
		}
	});
	//Проверяем столкновение
	function checkCollision (obj1, obj2) {
		return obj1.x === obj2.x && obj1.y ===obj2.y
	}
	//Создаём интервал
	function interval() {
		if (gameLoop) {
			clearTimeout(gameLoop);
			gameLoop = null;
		}
		if (!paused) {
			gameLoop = setTimeout(function () {
				nextSnake();
				draw();
				interval();
			}, delay);
		}
	}
	//Добавляем div со статусом игры внутри
	var gameStatus = document.createElement('div');
	gameStatus.style.display = 'none';
	gameStatus.classList.add('game-status');
	document.body.appendChild(gameStatus);
	var vkShare = document.querySelector('.vk-share'),
			fbShare = document.querySelector('.fb-share'),
			language = navigator.language || navigator.userLanguage;
	//Остановка игры
	function gameOver() {
		canvas.style.zIndex = '0';
		paused = true;
		gameStatus.innerHTML = 'gameOver';
		//Делимся прогрессом в социальных сетях
		if (language === 'ru' || language.toLowerCase() === 'ru-ru' || language === 'ua' || language === 'uk') {
			vkShare.href = 'https://vk.com/share.php?url=https://apaniuta.github.io/snake-game&title=Я заработал ' + highScore + ' очков в классической Змейке&description=Попробуйте тоже на своё компьютере-телефоне-планшете, это крутая игра!&image=https://dl.dropboxusercontent.com/u/34119723/web_sites/apaniuta.github.io/snake-game/img/Snake-game.png';
			fbShare.href = 'https://www.facebook.com/sharer.php?u=https://apaniuta.github.io/snake-game&t=Я заработал ' + highScore + ' очков в классической Змейке';
		} else {
			vkShare.href = 'https://vk.com/share.php?url=https://apaniuta.github.io/snake-game&title=I scored ' + highScore + ' points in the classic Snake game&description=Try it to on your desktop-phone-tablet, this is great game!&image=https://dl.dropboxusercontent.com/u/34119723/web_sites/apaniuta.github.io/snake-game/img/Snake-game.png';
			fbShare.href = 'https://www.facebook.com/sharer.php?u=https://apaniuta.github.io/snake-game&t=I scored ' + highScore + ' points in the classic Snake game';
		}
	}
	//Начало игры
	function start() {
		canvas.style.zIndex = '1';
		dir = DIR.RIGHT;
		speed = settedSpeed || 45;
		setDelay();
		score = 0;
		initSnake();
		createBlocks();
		initSnake();
		createFood();
		draw();
		paused = false;
		interval();
		gameStatus.innerHTML = '';
	}
	//Пауза
	function pause() {
		canvas.style.zIndex = '0';
		paused = true;
		gameStatus.innerHTML = 'paused';
	}
	canvas.addEventListener('click', function () {
		pause();
	});
	//Продолжаем игру после паузы
	function resume() {
		canvas.style.zIndex = '1';
		paused = false;
		interval();
		gameStatus.innerHTML = '';
	}
	//Инициализация игры
	function init() {
		dir = DIR.RIGHT;
		speed = speed || 45;
		paused = false;
		score = 0;
		//scale();
		initSnake();
		createBlocks();
		drawCanvas();
		drawSnake();
		if (withBlocks) {
			drawBlocks(blocks);
		}
		document.addEventListener('keydown', keyBindings);
	}
	//Методы, которые видны наружу
	return {
		//Инициализация
		init: init,
		//Старт
		start: start,
		//Продолжить игру после паузы
		resume: resume,
		//Рекордное кол-во очков
		getHighScore: function () {
				return highScore;
		},
		//Установка длины змейки (по умолчанию: 8)
		snakeLength: function (value) {
			if (value) {
				init();
				snakeLength = (value < grid)? value: grid - 1;
			} else {
				return snakeLength;
			}
		},
		//Установка границ поля (по умолчанию: с границами)
		setBoundaries: function (value) {
			if (value === 'yes') {
				boundaries = true;
			} else if (value === 'no') {
				boundaries = false;
			} else {
				throw Error('Введите "yes" или "no"');
			}
		},
		//Установка препятствий (по умолчанию: без препятствий)
		setBlocks: function (value) {
			if (value === 'yes') {
				withBlocks = true;
			} else if (value === 'no') {
				withBlocks = false;
			} else {
				throw Error('Введите "yes" или "no"');
			}
		},
		//Установка скорости игры (по умолчанию: средняя)
		setGameSpeed: function (value) {
			if (value === 'slow') {
				settedSpeed = 25;
			} else if (value === 'medium') {
				settedSpeed = 45;
			} else if (value === 'fast') {
				settedSpeed = 70;
			} else {
				throw Error('Скорость может быть "fast", "medium" или "slow"');
			}
		}
	}
})();