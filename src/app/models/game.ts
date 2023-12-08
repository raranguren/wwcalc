import {Team} from "./team";

export class Game {

  constructor(
    public players: number,
    public wolves: number,
  ){}

  clone(): Game {
    return new Game(this.players, this.wolves);
  }

  advance() {
    this.win = true;
  }

  private win = false;

  get ended() {
    return this.win;
  }

  get winner(): Team {
    return this.win ? Team.VILLAGE : Team.WOLVES;
  }

}
