type SettingsType = {
  gridSize: {
    cols: number;
    rows: number;
  }
}

type StatusType = 'pending' | 'in-process';

type PositionType = {
  x: number;
  y: number;
}

type PlayerType = {
  id: number;
  position: PositionType;
}

type GoogleType = {
  position: PositionType;
}

export class Game {
  #settings: SettingsType;
  #status: StatusType = 'pending';
  #player1: PlayerType;
  #player2: PlayerType;
  #google: GoogleType;

  #getRandomPosition(existedPosition: PositionType[] = []): PositionType {
    let newX;
    let newY;

    do {
      newX = NumberUtil.getRandomNumber(this.#settings.gridSize.cols);
      newY = NumberUtil.getRandomNumber(this.#settings.gridSize.rows);
    } while (existedPosition.some(({x, y}) => newX === x && newY === y))

    return new Position(newX, newY)

  }

  #createUnits() {
    const player1Position = this.#getRandomPosition()
    this.#player1 = new Player(1, player1Position);

    const player2Position = this.#getRandomPosition([player1Position]);
    this.#player2 = new Player(2, player2Position);

    const googlePosition = this.#getRandomPosition([player1Position, player2Position]);
    this.#google = new Google(googlePosition);
  }

  async start() {
    if(this.#status === 'pending') {
      this.#status = 'in-process';
      this.#createUnits()
    }
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
}

class Unit {
  position: PositionType;
  constructor(position) {
    this.position = position;
  }
}

class Player extends Unit {
  id: number;
  constructor(id, position) {
    super(position)
    this.id = id;
  }
}

class Google extends Unit{
  constructor(position) {
    super(position)
  }
}

class Position {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class NumberUtil {
  static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }
}