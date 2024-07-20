import {Game} from './js/game.ts';

const startGame = new Game();
startGame.settings = { gridSize: { rows: 10, cols: 10 } }
startGame.start();