import {Team} from "./team";
import {Phase} from "./phase";
import {Player} from "./player";
import {Role} from "./role";
import {Action} from "./action";

export class Game {

  private _phase: Phase = Phase.SIGN_UP;
  private _players: Player[] = [];
  private _winner?: Team;

  constructor(
    totalPlayers: number,
    numberOfWolves: number,
  ){
    const roles: Role[] = [];
    for (let i = 0; i<numberOfWolves; i++) {
      roles.push(Role.WEREWOLF);
    }
    for (let i = 0; i<totalPlayers; i++) {
      const role = roles[i] || Role.VILLAGER;
      this._players.push(new Player(role));
    }
    this.teamUp(this._players.filter(p => p.team == Team.WOLVES))
  }

  clone(): Game {
    return new Game(this.players, this.wolves);
  }

  teamUp(players: Player[]) {
    for (let player of players) {
      player.friends(players);
    }
  }

  get players(): number {
    return this._players.length;
  }

  get wolves(): number {
    return this._players
      .filter(p => p.team == Team.WOLVES)
      .length;
  }

  advance() {
    const playersAlive = this._players.filter(p => p.alive);
    this._phase = this._phase == Phase.DAY ? Phase.NIGHT : Phase.DAY;
    const tallies = new Map<Action, Map<Player, number>>();
    for (let player of playersAlive) {
      const actions = player.act(this._phase, playersAlive);
      for (let [action,player] of actions) {
        const tallyForAction = tallies.get(action) || new Map<Player, number>();
        const count = tallyForAction.get(player) || 0;
        tallyForAction.set(player, count + 1);
        tallies.set(action, tallyForAction);
      }
    }
    for (let [action, tally] of tallies) {
      const player = this.tieBreak(tally);
      if (player) {
        player.kill();
      }
    }
    this.updateWinCondition();
  }

  tieBreak(tally: Map<Player,number>): Player|null {
    let highestScorePlayers: Player[] = [];
    let highestScore = -Infinity;

    for (let [player, score] of tally.entries()) {
      if (score > highestScore) {
        highestScore = score;
        highestScorePlayers = [player];
      } else if (score === highestScore) {
        highestScorePlayers.push(player);
      }
    }

    if (highestScorePlayers.length === 0) {
      return null;
    } else if (highestScorePlayers.length === 1) {
      return highestScorePlayers[0];
    } else {
      const randomIndex = Math.floor(Math.random() * highestScorePlayers.length);
      return highestScorePlayers[randomIndex];
    }
  }

  updateWinCondition() {
    const alive = this._players.filter(p => p.alive);
    const evilCount = alive.filter(p => p.team == Team.WOLVES).length;
    const goodCount = alive.length - evilCount;
    if (evilCount == 0) {
      this._winner = Team.VILLAGE;
    } else if (evilCount >= goodCount) {
      this._winner = Team.WOLVES;
    }
  }

  get ended() {
    return this._winner !== undefined;
  }

  get winner(): Team|undefined {
    return this._winner;
  }

}
