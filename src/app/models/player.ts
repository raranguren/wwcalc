import {Role} from "./role";
import {Team} from "./team";
import {Place} from "./place";
import {Phase} from "./phase";
import {Action} from "./action";

export class Player {

  public place = Place.VILLAGE;
  private _actions = new Map<Phase, Action[]>;
  private _friends: Player[] = [];

  constructor(
    public role: Role
  ) {
    this._actions.set(Phase.DAY, [Action.VOTE]);
    if (this.team == Team.WOLVES) {
      this._actions.set(Phase.NIGHT, [Action.ATTACK]);
    }
    if (this.role == Role.GUARD) {
      this._actions.set(Phase.NIGHT, [Action.GUARD]);
    }
  }

  get alive(): boolean {
    return this.place != Place.GRAVEYARD;
  }

  get team(): Team {
    switch (this.role) {
      case Role.WEREWOLF:
        return Team.WOLVES;
      default:
        return Team.VILLAGE;
    }
  }

  friends(friends: Player[]) {
    this._friends = friends;
  }

  act(phase: Phase, playersAlive: Player[]): Map<Action,Player> {
    const actions = new Map<Action,Player>();
    const legalActions = this._actions.get(phase);
    if (legalActions) {
      for (let action of legalActions) {
        if (action == Action.GUARD) {
          actions.set(action, this.pickFriend(playersAlive));
        } else {
          actions.set(action, this.pickEnemy(playersAlive));
        }
      }
    }
    return actions;
  }

  die() {
    this.place = Place.GRAVEYARD;
  }

  pickEnemy(targets: Player[]): Player {
    const enemies = targets.filter(target => !this._friends.includes(target));
    if (enemies.length === 0) return this;
    const randomIndex = Math.floor(Math.random() * enemies.length);
    return enemies[randomIndex];
  }

  pickFriend(targets: Player[]): Player {
    const friends = targets.filter(target => this._friends.includes(target));
    if (friends.length === 0) return this;
    const randomIndex = Math.floor(Math.random() * friends.length);
    return friends[randomIndex];
  }

}
