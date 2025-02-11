import {EventEmitter} from "./eventEmitter.ts";

export type SettingsType = {
  gridSize: {
    cols: number;
    rows: number;
  },
  googleJumpInterval: number;
  pointsToWin: number;
  pointsToLose: number;
}

type StatusType = 'pending' | 'in-process' | 'paused' | 'finished';



type PlayerType = {
  id: number;
  position: Position;
}

type GoogleType = {
  position: Position;
}

type DeltaType = {x: number} | {y: number}

export type ScoreType = {
  [playerId: number]: {points: number}
}

export class Game {
  #settings: SettingsType;
  #status: StatusType = 'pending';
  #player1: PlayerType;
  #player2: PlayerType;
  #google: GoogleType;
  #googleJumpIntervalId: number;
  #score: ScoreType = {
    1: {points: 0},
    2: {points: 0},
    3: {points: 0}
  };
  eventEmitter: EventEmitter

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter
  }

  #getRandomPosition(existedPosition: Position[] = []): Position {
    let newX;
    let newY;

    do {
      newX = NumberUtil.getRandomNumber(this.#settings.gridSize.cols);
      newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
    } while (existedPosition.some(({x, y}) => newX === x && newY === y))

    return new Position(newX, newY)

  }

  #moveGoogleToRandomPosition(excludeGoogle: boolean) {
    if(this.#score[3].points === this.#settings.pointsToLose){
      this.finishedGame()
      return;
    }
    let occupiedPositions = [this.#player1.position, this.#player2.position];

    if(!excludeGoogle) {
      occupiedPositions.push(this.#google.position)
    }

    this.#google = new Google(this.#getRandomPosition(occupiedPositions));
    this.eventEmitter.emit('changePosition')
  }

  #createUnits() {
    const player1Position = this.#getRandomPosition();
    this.#player1 = new Player(1, player1Position);

    const player2Position = this.#getRandomPosition([player1Position]);
    this.#player2 = new Player(2, player2Position);

    this.#moveGoogleToRandomPosition(true);

  }

  #startInterval() {
    this.#googleJumpIntervalId = setInterval(() => {
      this.#score[3].points += 1;
      this.#moveGoogleToRandomPosition(false);
    }, this.#settings.googleJumpInterval)
  }

  async start() {
    if(this.#status === 'pending') {
      this.#status = 'in-process';
      this.#createUnits();
    }
    this.#startInterval();
  }

  async stop() {
    this.#status = 'paused';
    clearInterval(this.#googleJumpIntervalId);
  }

  finishedGame() {
    this.#status = 'finished';
    this.#google = new Google(new Position(0,  0));
    clearInterval(this.#googleJumpIntervalId);
    this.eventEmitter.emit('changePosition')
  }

  //Проверки местоположения
  #checkBorder(player: PlayerType, delta: DeltaType): boolean {
    const newPosition = player.position.clone();

    if('x' in delta) {
      newPosition.x += delta.x;
      if(newPosition.x < 1 || newPosition.x > this.#settings.gridSize.cols) {
        return false;
      }
    } else if('y' in delta) {
      newPosition.y += delta.y;
      if(newPosition.y < 1 || newPosition.y > this.#settings.gridSize.rows) {
        return false;
      }
    }

    return true;
  }

  #checkAnotherPlayerPosition(movingPlayer: PlayerType, standingPlayer: PlayerType, delta: DeltaType) {
    const newPosition = movingPlayer.position.clone();

    if('x' in delta) {
      newPosition.x += delta.x;
    } else if('y' in delta) {
      newPosition.y += delta.y;
    }

    return newPosition.equal(standingPlayer.position)
  }

  #googleCatching(player: PlayerType) {
    if(player.position.equal(this.#google.position)) {
      this.#score[player.id].points += 1;
      if(this.#score[player.id].points === this.#settings.pointsToWin){
        this.finishedGame()
      } else {
        clearInterval(this.#googleJumpIntervalId);
        this.#startInterval();
        this.#moveGoogleToRandomPosition(false);
      }
    } else {
      return
    }
  }

  #movePlayer(movePlayer: PlayerType, anotherPlayer: PlayerType, delta: DeltaType) {
    const isBorder = this.#checkBorder(movePlayer, delta);
    const isAnotherPlayer = this.#checkAnotherPlayerPosition(movePlayer, anotherPlayer, delta);

    if(!isBorder || isAnotherPlayer){
      return;
    }

    if('x' in delta){
      movePlayer.position.x += delta.x;
    } else if('y' in delta){
      movePlayer.position.y += delta.y;
    }

    this.#googleCatching(movePlayer);
    this.eventEmitter.emit('changePosition');
  }

  //Перемещение игроков
  movePlayer1Left() {
    const delta = {x: -1}

    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Right() {
    const delta = {x: 1}

    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Up() {
    const delta = {y: -1}

    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer1Down() {
    const delta = {y: 1}

    this.#movePlayer(this.#player1, this.#player2, delta)
  }

  movePlayer2Left() {
    const delta = {x: -1}

    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Right() {
    const delta = {x: 1}

    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Up() {
    const delta = {y: -1}

    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  movePlayer2Down() {
    const delta = {y: 1}

    this.#movePlayer(this.#player2, this.#player1, delta)
  }

  set settings(settings) {
    this.#settings = settings;
  }

  get settings() {
    return this.#settings;
  }

  get status() {
    return this.#status;
  }

  get player1() {
    return this.#player1;
  }

  get player2() {
    return this.#player2;
  }

  get google() {
    return this.#google;
  }

  get score() {
    return this.#score;
  }
}

class Unit {
  position: Position;
  constructor(position: Position) {
    this.position = position;
  }
}

class Player extends Unit {
  id: number;
  constructor(id, position: Position) {
    super(position)
    this.id = id;
  }
}

class Google extends Unit{
  constructor(position: Position) {
    super(position)
  }
}

export class Position {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone(): Position{
    return new Position(this.x, this.y);
  }

  equal(anotherPosition: Position): boolean {
    return this.x === anotherPosition.x && this.y === anotherPosition.y;
  }

}

class NumberUtil {
  static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }
}