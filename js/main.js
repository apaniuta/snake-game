//gameSnake.snakeLength(10); //Установка длины змейки (по умолчанию: 8)
//gameSnake.setBoundaries('no'); //Установка границ поля (по умолчанию: без границ)
//gameSnake.setBlocks('yes'); //Установка препятствий (по умолчанию: с препятствиями)
//gameSnake.setGameSpeed('slow'); //Установка скорости игры (по умолчанию: средняя)
gameSnake.init(); //Инициализация
//gameSnake.start();
var DOMelements = {
		snake: document.querySelector('.snake'),
		overlay: document.querySelector('.overlay'),
		mainMenu: document.querySelector('.main-menu'),
		newGame: document.querySelector('.new-game h1'),
		gameOptions: document.querySelector('.game-options h1'),
		optionsValues: document.querySelector('.options-values'),
		backToMenuFromOptions: document.querySelector('.back-from-options h2'),
		yesBound: document.querySelector('.boundaries .yes'),
		noBound: document.querySelector('.boundaries .no'),
		yesBlocks: document.querySelector('.blocks .yes'),
		noBlocks: document.querySelector('.blocks .no'),
		speedSlow: document.querySelector('.slow'),
		speedMedium: document.querySelector('.medium'),
		speedFast: document.querySelector('.fast'),
		pauseMenu: document.querySelector('.pause-menu'),
		resume: document.querySelector('.resume h1'),
		backToMenuFromPause: document.querySelector('.back-from-pause h1'),
		reMenu: document.querySelector('.re-menu'),
		playAgain: document.querySelector('.play-again h2'),
		backToMenuFromGameover: document.querySelector('.back-from-re-menu h2'),
		highScoreValue: document.querySelector('.high-score-value'),
		gameStatus: document.querySelector('.game-status'),
		controlBtns: document.querySelector('.control-btns')
};
function fadeIn(el, speed) {
	el.style.opacity = 0;
	el.classList.toggle('hidden');
	var last = +new Date();
	var tick = function() {
		el.style.opacity = +el.style.opacity + (new Date() - last) / (speed || 200);
		last = +new Date();

		if (+el.style.opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
		}
	};
	
	tick();
	
}

function fadeOut(el, speed) {
	el.style.opacity = 1;

	var last = +new Date();
	var tick = function() {
		el.style.opacity = +el.style.opacity - (new Date() - last) / (speed || 200);
		last = +new Date();

		if (+el.style.opacity > 0) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
		}
		if (+el.style.opacity <= 0) {
				el.classList.toggle('hidden');
				el.style.opacity = 1;
			}
	};
	
	tick();
}

//Проверка статуса игры
function checkStatus() {
	var interval;
	interval = setInterval(function() {
		if (DOMelements.gameStatus.innerHTML === 'paused') {
			clearInterval(interval);
			fadeIn(DOMelements.overlay);
			fadeIn(DOMelements.pauseMenu);
		}
		if (DOMelements.gameStatus.innerHTML === 'gameOver') {
			DOMelements.highScoreValue.innerHTML = gameSnake.getHighScore();
			clearInterval(interval);
			fadeIn(DOMelements.overlay, 400);
			fadeIn(DOMelements.reMenu, 600);
		}
	}, 10);
}

DOMelements.snake.addEventListener('mousedown', function (e) {
	e.preventDefault();
});

DOMelements.newGame.addEventListener('click', function () {
	fadeOut(DOMelements.overlay);
	fadeOut(DOMelements.mainMenu);
	setTimeout(function() {
		gameSnake.start();
		checkStatus();
	}, 200);
});

DOMelements.gameOptions.addEventListener('click', function () {
	fadeOut(DOMelements.mainMenu);
	setTimeout(function() {
		fadeIn(DOMelements.optionsValues);
	}, 200);
});

DOMelements.backToMenuFromOptions.addEventListener('click', function () {
	fadeOut(DOMelements.optionsValues);
	setTimeout(function() {
		fadeIn(DOMelements.mainMenu);
	}, 200);
});

DOMelements.yesBound.addEventListener('click', function (e) {
	gameSnake.setBoundaries('yes');
	DOMelements.yesBound.classList.add('focused');
	DOMelements.noBound.classList.remove('focused');
});

DOMelements.noBound.addEventListener('click', function (e) {
	gameSnake.setBoundaries('no');
	DOMelements.noBound.classList.add('focused');
	DOMelements.yesBound.classList.remove('focused');
});

DOMelements.yesBlocks.addEventListener('click', function () {
	gameSnake.setBlocks('yes');
	DOMelements.yesBlocks.classList.add('focused');
	DOMelements.noBlocks.classList.remove('focused');
});

DOMelements.noBlocks.addEventListener('click', function () {
	gameSnake.setBlocks('no');
	DOMelements.noBlocks.classList.add('focused');
	DOMelements.yesBlocks.classList.remove('focused');
});

DOMelements.speedSlow.addEventListener('click', function () {
	gameSnake.setGameSpeed('slow');
	DOMelements.speedSlow.classList.add('focused');
	DOMelements.speedMedium.classList.remove('focused');
	DOMelements.speedFast.classList.remove('focused');
});

DOMelements.speedMedium.addEventListener('click', function () {
	gameSnake.setGameSpeed('medium');
	DOMelements.speedSlow.classList.remove('focused');
	DOMelements.speedMedium.classList.add('focused');
	DOMelements.speedFast.classList.remove('focused');
});

DOMelements.speedFast.addEventListener('click', function () {
	gameSnake.setGameSpeed('fast');
	DOMelements.speedSlow.classList.remove('focused');
	DOMelements.speedMedium.classList.remove('focused');
	DOMelements.speedFast.classList.add('focused');
});

DOMelements.resume.addEventListener('click', function () {
	fadeOut(DOMelements.overlay);
	fadeOut(DOMelements.pauseMenu);
	setTimeout(function() {
		gameSnake.resume();
		checkStatus();
	}, 200);
});

DOMelements.backToMenuFromPause.addEventListener('click', function () {
	fadeOut(DOMelements.pauseMenu);
	setTimeout(function() {
		fadeIn(DOMelements.mainMenu);
	}, 200);
});

DOMelements.playAgain.addEventListener('click', function () {
	fadeOut(DOMelements.overlay);
	fadeOut(DOMelements.reMenu);
	setTimeout(function() {
		gameSnake.start();
		checkStatus();
	}, 200);
});

DOMelements.backToMenuFromGameover.addEventListener('click', function () {
	fadeOut(DOMelements.reMenu);
	setTimeout(function() {
		fadeIn(DOMelements.mainMenu);
	}, 200);
});
//Проверяем девайс, если мобильный или планшет добавляем кнопки для управления
//!Нужно подключить библиотеку device.js!
if (device.mobile() || device.tablet()) {
	DOMelements.controlBtns.classList.remove('hidden');
}
//Масштабируем игру
DOMelements.snake.style.height = DOMelements.snake.clientWidth + 'px';
document.documentElement.style.fontSize = DOMelements.snake.clientWidth / 31 + 'px';
window.addEventListener('resize', function () {
	DOMelements.snake.style.height = DOMelements.snake.clientWidth + 'px';
	document.documentElement.style.fontSize = DOMelements.snake.clientWidth / 31 + 'px';
});