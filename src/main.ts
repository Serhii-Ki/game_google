import {Game, Position, ScoreType, SettingsType} from './js/game.ts';

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

    const startGame = new Game();
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
    for (let row = 0; row < settings.gridSize.rows; row++) {
      for (let col = 0; col < settings.gridSize.cols; col++) {
        const field = document.createElement('div');
        field.classList.add('field');
        gridField.appendChild(field);
      }
    }
    const fields = gridField.querySelectorAll('.field');
    fields.forEach((field, index) => {
      const row = Math.floor(index / settings.gridSize.cols);
      const col = index % settings.gridSize.cols;

      if (row === player1Position.y && col === player1Position.x) {
        console.log('Player1 for', row, col);
        field.innerHTML = '<img src="src/assets/player1.svg" alt="player1 image">';
      } else if (row === player2Position.y && col === player2Position.x) {
        console.log('Player2 for', row, col);
        field.innerHTML = '<img src="src/assets/player2.svg" alt="player2 image">';
      } else if (row === googlePosition.y && col === googlePosition.x) {
        console.log('Google for', row, col);
        field.innerHTML = '<img src="src/assets/google.svg" alt="google image">';
      }
    });
  }

  startBtn.addEventListener('click', () => {
    startGame()
  });

  menuBtn.addEventListener('click', () => {
    goMenuDisplay()
  });
}

game();



