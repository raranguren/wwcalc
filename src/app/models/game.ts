import {Team} from "./team";
import {Phase} from "./phase";
import {Player} from "./player";
import {Role} from "./role";
import {Action} from "./action";
import {Chat} from "./chat";

/** 
 * Represents the state of a game, including the players in it, roles, phases, etc. 
 * The game setup is passed on the constructor. It then internally
 * assigns roles to the players and starts in day 1 with the voting phase.
 * 
 * The method advance() simulates the actions of all players for the day, and 
 * advances the state to the next phase.
 * 
 * After each advance, the new state can be accessed through getters.
 */
export class Game {

  private _phase: Phase = Phase.SIGN_UP;
  private _players: Player[] = [];
  private _winner?: Team;
  private _day = 0;
  private _initialRoleCounts;

  constructor(
    totalPlayers: number,
    roleCounts: {role: Role, count: number}[],
  ){
    this._initialRoleCounts = roleCounts;
    const roles: Role[] = [];
    for (const {role, count} of roleCounts) {
      roles.push(...Array(count).fill(role));
    }

    for (let i = 0; i<totalPlayers; i++) {
      const role = roles[i] || Role.VILLAGER;
      this._players.push(new Player(role));
    }
    this.teamUp(this._players.filter(p => p.team == Team.WOLVES));
    this.teamUp(this._players.filter(p => p.role == Role.GUARD));
    this.seerEachother(this._players.filter(p => p.role == Role.MASON));
  }

  /** 
   * Returns a new game that uses the same setup as this one 
   * @deprecated in favor of the constructor 
   */
  clone(): Game {
    return new Game(this.players, this._initialRoleCounts);
  }

  /** Adds players to a group chat so they can coordinate */
  private teamUp(players: Player[]) {
    const chat = new Chat();
    for (const player of players) {
      player.friends(players);
      player.chat(chat);
    }
  }

  /** Reveals roles to eachother */
  private seerEachother(players: Player[]) {
    for (const player of players) {
      player.friends(players);
    }
  }

  /** @readonly The initial number of players */
  get players(): number {
    return this._players.length;
  }

  /** The number of players with a certain role */
  roleCount(role: Role): number {
    return this._players
      .filter(p => p.role == role)
      .length;
  }

  /** The number of players in a team */
  teamCount(team : Team): number {
    return this._players
      .filter(p => p.team == team)
      .length;
  }

  /** @readonly Indicates if villagers have special roles */
  get hasSpecialVillagers(): boolean {
    return this._players
      .filter(p => p.team == Team.VILLAGE && p.role != Role.VILLAGER)
      .length > 0;
  }

  /** Advances the game to the next phase, simulating all actions from players */
  advance() {
    const playersAlive = this._players.filter(p => p.alive);
    this._phase = this._phase == Phase.DAY ? Phase.NIGHT : Phase.DAY;
    if (this._phase == Phase.DAY) this._day++;
    const tallies = new Map<Action, Map<Player, number>>();
    for (const player of playersAlive) {
      const actions = player.act(this._phase, playersAlive);
      for (const [action,target] of actions) {
        const tallyForAction = tallies.get(action) || new Map<Player, number>();
        const count = tallyForAction.get(target) || 0;
        tallyForAction.set(target, count + 1);
        tallies.set(action, tallyForAction);
        if (action == Action.SCOUT) {
          player.scoutResult(target, this.nightActivity(target.role));
        }
      }
    }
    const guarded: Player[] = [];
    const attacked: Player[] = [];
    const hanged: Player[] = [];
    const healed: Player[] = [];
    for (const [action, tally] of tallies) {
      const target = this.tieBreak(tally);
      if (target) {
        if (action == Action.GUARD) {
          guarded.push(target);
        }
        if (action == Action.ATTACK) {
          attacked.push(target);
        }
        if (action == Action.VOTE) {
          hanged.push(target);
        }
      }
      if (action == Action.HEAL) {
        healed.push(...tally.keys());
      }
    }
    for (const player of hanged) {
      player.die();
    }
    for (const player of attacked) {
      if (guarded.includes(player)) {
        const wolves = this._players.filter(p => p.team == Team.WOLVES);
        const guards = this._players.filter(p => p.role == Role.GUARD);
        const deadWolf = wolves[Math.floor(Math.random() * wolves.length)];
        const guard = guards[Math.floor(Math.random() * guards.length)];
        if (healed.includes(guard)) {
          this.revealGood(guard);
        } else {
          guard.die();
        }
        deadWolf.die();
        this.revealGood(player);
      } else {
        if (healed.includes(player)) {
          this.revealGood(player);
        } else if (player.role == Role.LYCAN) {
          player.role = Role.WEREWOLF;
          const wolves = this._players.filter(p => p.team == Team.WOLVES);
          this.teamUp(wolves);
        } else {
          player.die();
        }
      }
    }
    this.updateWinCondition();
  }

  /** Lets all good players know that this player is good */
  private revealGood(player: Player) {
    this._players
      .filter(p => p.team == Team.VILLAGE)
      .forEach(p => p.friends([player]));
  }

  /** Determines which player is the target after  votes have been casted */
  private tieBreak(tally: Map<Player,number>): Player|null {
    let highestScorePlayers: Player[] = [];
    let highestScore = -Infinity;

    for (const [player, score] of tally.entries()) {
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

  /** Verifies if one of the teams has won the game */
  private updateWinCondition() {
    const alive = this._players.filter(p => p.alive);
    const evilCount = alive.filter(p => p.team == Team.WOLVES).length;
    const goodCount = alive.length - evilCount;
    if (evilCount == 0) {
      this._winner = Team.VILLAGE;
    } else if (evilCount >= goodCount) {
      this._winner = Team.WOLVES;
    }
  }

  /** @readonly Indicates that the game has ended */
  get ended():boolean {
    return this._winner !== undefined;
  }

  /** @readonly Returns the team that won, if any */
  get winner(): Team|undefined {
    return this._winner;
  }

  /** @readonly The number of days that passed (minimum 1) */
  get days(): number {
    return this._day;
  }

  /** @readonly The list of roles in a team, with duplicates */
  get roles(): Role[] {
    return this._players.map(player => player.role);
  }

  /** Determines if a role has night activity */
  nightActivity(role: Role) {
    return role == Role.WEREWOLF || role == Role.GUARD || role == Role.HEALER || role == Role.SCOUT;
  }

}
