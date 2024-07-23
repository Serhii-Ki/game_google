import {Game, SettingsType} from './js/game.ts';

function startGame() {
  const selectSettings = document.querySelectorAll<HTMLSelectElement>('.select');
  const startBtn = document.querySelector<HTMLButtonElement>('.start-btn');
  const gameDisplay = document.querySelector<HTMLDivElement>('.main-content');
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


  startBtn.addEventListener('click', () => {
    gameDisplay.style.display = 'block';
    startBtn.style.display = 'none';

    const startGame = new Game();
    startGame.settings = getSettings();
  })

  // startGame.start();
}

startGame()


