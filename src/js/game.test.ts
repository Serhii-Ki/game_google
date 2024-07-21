import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {Game} from './game.ts';

describe('game test', () => {
  let game
  beforeEach(() => {
    game = new Game();
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
    const prevGooglePosition = game.player1.position.clone()
    await delay(110);

    expect(prevGooglePosition.equal(game.google.position)).toBe(false);
  });

});

function delay (ms: number)  {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}