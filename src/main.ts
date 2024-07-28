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
  const winText = document.querySelector<HTMLHtmlElement>('.finished-game');

  const getSettings = (): SettingsType => {
    return {
      gridSize: {
        rows: parseInt(selectSettings[0].value),
        cols: parseInt(selectSettings[1].value)
      },
      googleJumpInterval: 2000,
      pointsToWin: parseInt(selectSettings[2].value),
      pointsToLose: parseInt(selectSettings[3].value)
    };
  }

  const goStartDisplay = () => {
    gameDisplay.style.display = 'block';
    menuBtn.style.display = 'block';
    startBtn.style.display = 'none';
    selectSettings.forEach(select => select.disabled = true);

  };

  const startGame = () => {
    goStartDisplay();

    const eventEmitter = new EventEmitter();
    const startGame = new Game(eventEmitter);
    startGame.settings = getSettings();
    startGame.start();
    const settings: SettingsType = startGame.settings
    const score: ScoreType = startGame.score;
    gridField.style.gridTemplateRows = `repeat(${settings.gridSize.rows}, 85px)`;
    gridField.style.gridTemplateColumns = `repeat(${settings.gridSize.cols}, 85px)`;
    console.log(startGame.settings.pointsToLose)
    const setPointsTimer = () => {
      player1Count.textContent = score[1].points.toString();
      player2Count.textContent = score[2].points.toString();
      googleCount.textContent = score[3].points.toString();
    }

    setPointsTimer();

    const winGame = () => {
      if(score[3].points === settings.pointsToLose) {
        winText.textContent = 'Google wins!';
        winText.style.opacity = '1';
      } else if (score[2].points === settings.pointsToWin) {
        winText.textContent = 'Player 2 wins!';
        winText.style.opacity = '1';
      } else if (score[1].points === settings.pointsToWin) {
        winText.textContent = 'Player 1 wins!';
        winText.style.opacity = '1';
      }
    }

    const render = () => {
      winGame()
      gridField.innerHTML = '';
      let player1Position: Position = startGame.player1.position;
      let player2Position: Position = startGame.player2.position;
      let googlePosition: Position = startGame.google.position;

      setPointsTimer();

      for (let row = 1; row <= settings.gridSize.rows; row++) {
        for (let col = 1; col <= settings.gridSize.cols; col++) {
          const field = document.createElement('div');
          field.classList.add('field');
          gridField.appendChild(field);

          if (row === player1Position.y && col === player1Position.x) {
            field.innerHTML = '<img src="src/assets/player1.svg" alt="player1 image">';
          } else if (row === player2Position.y && col === player2Position.x) {
            field.innerHTML = '<img src="src/assets/player2.svg" alt="player2 image">';
          } else if (row === googlePosition.y && col === googlePosition.x) {
            field.innerHTML = '<img src="src/assets/google.svg" alt="google image">';
          }
        }
      }
    }

    render();

    startGame.eventEmitter.subscribe('changePosition', render)

    window.addEventListener('keydown', (event: KeyboardEvent) => {
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
    });

    const goMenuDisplay = () => {
      gameDisplay.style.display = 'none';
      menuBtn.style.display = 'none';
      startBtn.style.display = 'block';
      selectSettings.forEach(select => select.disabled = false);
      winText.textContent = '';
      winText.style.opacity = '0';
      startGame.stop();
    }

    menuBtn.addEventListener('click', () => {
      goMenuDisplay()
    });

  }

  startBtn.addEventListener('click', () => {
    startGame()
  });

}

game();



