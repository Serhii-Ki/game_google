import {Game, Position, ScoreType, SettingsType} from './js/game.ts';
import {EventEmitter} from "./js/eventEmitter.ts";

function game() {
  const selectSettings = document.querySelectorAll<HTMLSelectElement>('.select');
  const startBtn = document.querySelector<HTMLButtonElement>('.start-btn');
  const menuBtn = document.querySelector<HTMLButtonElement>('.menu-btn');
  const gameDisplay = document.querySelector<HTMLDivElement>('.main-content');
  const player1Count = document.querySelector<HTMLSpanElement>('.player1-count');
  const player2Count = document.querySelector<HTMLSpanElement>('.player2-count');
  const googleCount = document.querySelector<HTMLSpanElement>('.google-count');
  const timer = document.querySelector<HTMLSpanElement>('.timer');
  const gridField = document.querySelector<HTMLDivElement>('.grid-wrap');

  const getSettings = (): SettingsType => {
    return {
      gridSize: {
        rows: parseInt(selectSettings[0].value),
        cols: parseInt(selectSettings[1].value)
      },
      googleJumpInterval: 5000,
      pointsToWin: parseInt(selectSettings[2].value),
      pointsToLose: parseInt(selectSettings[3].value)
    };
  }

  const goStartDisplay = () => {
    gameDisplay.style.display = 'block';
    menuBtn.style.display = 'block';
    startBtn.style.display = 'none';
    selectSettings.forEach(select => select.disabled = true);

  }

  const goMenuDisplay = () => {
    gameDisplay.style.display = 'none';
    menuBtn.style.display = 'none';
    startBtn.style.display = 'block';
    selectSettings.forEach(select => select.disabled = false);
  }

  const startGame = () => {
    goStartDisplay();

    const eventEmitter = new EventEmitter();
    const startGame = new Game(eventEmitter);
    startGame.settings = getSettings();
    startGame.start();
    const settings: SettingsType = startGame.settings
    const score: ScoreType = startGame.score;
    const player1Position: Position = startGame.player1.position;
    const player2Position: Position = startGame.player2.position;
    const googlePosition: Position = startGame.google.position;


    player1Count.textContent = score[1].points.toString();
    player2Count.textContent = score[2].points.toString();
    googleCount.textContent = score[3].points.toString();
    timer.textContent = (settings.googleJumpInterval / 1000).toString();
    gridField.style.gridTemplateRows = `repeat(${settings.gridSize.rows}, 85px)`;
    gridField.style.gridTemplateColumns = `repeat(${settings.gridSize.cols}, 85px)`;

    gridField.innerHTML = '';
    for (let row = 1; row <= settings.gridSize.rows; row++) {
      for (let col = 1; col <= settings.gridSize.cols; col++) {
        const field = document.createElement('div');
        field.classList.add('field');
        gridField.appendChild(field);

        if(row === player1Position.x && col === player1Position.y) {
          console.log('Row Col', row, col);
          console.log('Player1 for', player1Position);
          field.innerHTML = '<img src="src/assets/player1.svg" alt="player1 image">';
        } else if( row === player2Position.x && col === player2Position.y){
          field.innerHTML = '<img src="src/assets/player2.svg" alt="player2 image">';
          console.log('Player2 for', player2Position);
          console.log('Player2 Row Col', row, col);
        } else if(row === googlePosition.x && col === googlePosition.y) {
          field.innerHTML = '<img src="src/assets/google.svg" alt="google image">';
          console.log('googlePosition', googlePosition);
        }
      }
    }

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          startGame.movePlayer1Left();
          break;
        case 'ArrowRight':
          startGame.movePlayer1Right();
          break;
        case 'ArrowUp':
          startGame.movePlayer1Up();
          break;
        case 'ArrowDown':
          startGame.movePlayer1Down();
          break;
        case 'KeyA':
          startGame.movePlayer2Left();
          break;
        case 'KeyD':
          startGame.movePlayer2Right();
          break;
        case 'KeyW':
          startGame.movePlayer2Up();
          break;
        case 'KeyS':
          startGame.movePlayer2Down();
          break;
      }
    })
  }

  startBtn.addEventListener('click', () => {
    startGame()
  });

  menuBtn.addEventListener('click', () => {
    goMenuDisplay()
  });

}

game();



