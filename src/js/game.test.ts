import { describe, it, expect } from 'vitest';
import {Game} from './game.ts';

describe('game test', () => {
  it('initialization test', async () => {
    const game = new Game();

    game.settings = {
      gridSize: {
        cols: 4,
        rows: 5
      }
    };

    expect(game.status).toBe('pending');
    await game.start();
    expect(game.status).toBe('in-process');
  });

  it('player1, player2 and google should have unique coordinates', async () => {
    const game = new Game();
    game.settings = {
      gridSize: {
        rows: 3,
        cols: 1
      }
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

})