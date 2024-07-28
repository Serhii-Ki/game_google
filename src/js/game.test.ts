import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {Game, Position} from './game.ts';
import {EventEmitter} from './eventEmitter.ts'; // Добавьте этот импорт

describe('game test', () => {
  let game;
  beforeEach(() => {
    game = new Game(new EventEmitter());
  });

  afterEach(async () => {
    await game.stop();
  })

  it('initialization test', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 10
    };

    expect(game.status).toBe('pending');
    await game.start();
    expect(game.status).toBe('in-process');
  });

  it('player1, player2 and google should have unique coordinates', async () => {
    game.settings = {
      gridSize: {
        rows: 3,
        cols: 1
      },
      googleJumpInterval: 0,
      pointsToWin: 10
    };

    await game.start();

    expect([1]).toContain(game.player1.position.x);
    expect([1]).toContain(game.player2.position.x);

    expect([1, 2, 3]).toContain(game.player1.position.y);
    expect([1, 2, 3]).toContain(game.player2.position.y);

    expect(
        (game.player1.position.x !== game.player2.position.x ||
            game.player1.position.y !== game.player2.position.y) &&
        (game.player1.position.x !== game.google.position.x ||
            game.player1.position.y !== game.google.position.y) &&
        (game.player2.position.x !== game.google.position.x ||
            game.player2.position.y !== game.google.position.y)
    ).toBe(true)

  });

  it('google position should changed', async () => {
    game.settings = {
      gridSize: {
        rows: 2,
        cols: 2
      },
      googleJumpInterval: 100,
      pointsToWin: 10
    };

    await game.start();
    const prevGooglePosition = game.google.position.clone()
    await delay(110);

    expect(prevGooglePosition.equal(game.google.position)).toBe(false);
  });

  it('player1 should move left', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 10
    };

    await game.start();
    const initialPosition = game.player1.position.clone();
    game.movePlayer1Left();
    expect(game.player1.position.x).toBe(initialPosition.x - 1);
  });

  it('player1 should not move out of bounds', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 10
    };

    await game.start();
    game.player1.position = new Position(1, 1);
    game.movePlayer1Left();
    expect(game.player1.position.x).toBe(1);
  });

  it('player1 should not move to player2 position', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 10
    };

    await game.start();
    game.player1.position = new Position(1, 1);
    game.player2.position = new Position(2, 1);
    game.movePlayer1Right();
    expect(game.player1.position.x).toBe(1);
  });

  it('player1 should catch google', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 1
    };

    await game.start();
    game.player1.position = new Position(1, 1);
    game.google.position = new Position(2, 1);
    game.movePlayer1Right();
    console.log(`Player 1 points: ${game.score[1].points}`);
    expect(game.score[1].points).toBe(1);
  });

  it('game should finish when player1 catches google enough times', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 0,
      pointsToWin: 1
    };

    await game.start();
    game.player1.position = new Position(1, 1);
    game.google.position = new Position(2, 1);
    game.movePlayer1Right();
    expect(game.status).toBe('finished');
  });

  it('game should finish when google is not caught enough times', async () => {
    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      },
      googleJumpInterval: 100,
      pointsToLose: 1
    };

    await game.start();
    await delay(110);
    expect(game.status).toBe('finished');
  });
});

function delay (ms: number)  {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
