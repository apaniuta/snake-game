## Snake game
My javascript/canvas implementation of famous game - Snake.

### Features: 

- Scaling to different screen resolution.

- The game has different options such as: play with or without boundaries, play with blocks or without, change speed of game.

- Сan be played on desktop PCs and on mobile devices.

### Global methods: 

    gameSnake.snakeLength(10); //Setup length of snake (default: 8).
    gameSnake.setBoundaries('no'); //Setup boundaries of the field (default: with boundaries).
    gameSnake.setBlocks('yes'); //Setup blocks (default: without blocks).
    gameSnake.setGameSpeed('slow'); //Setup speed of game (default: medium). Values: 'slow', 'medium', 'fast'.
    gameSnake.getHighScore(); //Getting high score
    gameSnake.init(); //Initialization
    gameSnake.start(); //Starting the game
    gameSnake.resume(); //Resuming the game

### Try it online:
http://apaniuta.github.io/snake-game
