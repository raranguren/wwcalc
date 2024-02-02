import {Role} from "./role";
import {Team} from "./team";
import {Place} from "./place";
import {Phase} from "./phase";
import {Action} from "./action";
import {Chat} from "./chat";

/** 
 * Represents the state of a player and the information they know.
 * Their initial role is assigned in the constructor, and it determines
 * their behavior in each phase of the game.
 */
export class Player {

  public place = Place.VILLAGE;
  private _actions = new Map<Phase, Action[]>;
  private _friends: Player[] = [];
  private _chats: Chat[] = [];

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
    if (this.role == Role.HEALER) {
      this._actions.set(Phase.NIGHT, [Action.HEAL]);
    }
  }

  /** @readonly Is alive or not */
  get alive(): boolean {
    return this.place != Place.GRAVEYARD;
  }

  /** @readonly What side do they belong to */
  get team(): Team {
    switch (this.role) {
      case Role.WEREWOLF:
        return Team.WOLVES;
      default:
        return Team.VILLAGE;
    }
  }

  /** Let this player know that other players are friends (in the same team, basically) */
  friends(newFriends: Player[]) {
    this._friends = [...this._friends, ...newFriends];
  }

  /** 
   * Returns the actions that this player tries to do in each phase of the game.
   * For each action, they choose a target player (friend or foe, depending on the action).
   * - For a vote, this is the voted player.
   * - For group actions (like guarding) these are the player's choice, and the
   *   group then targets the target that is mentioned more often.
   * - For indivisual actions like healing a player, they will target that player
   */
  act(phase: Phase, playersAlive: Player[]): Map<Action,Player> {
    const actions = new Map<Action,Player>();
    const legalActions = this._actions.get(phase);
    if (legalActions) {
      for (let action of legalActions) {
        if (action == Action.GUARD) {
          actions.set(action, this.pickFriendOrSelf(playersAlive));
        } else if (action == Action.HEAL) {
          actions.set(action, this.pickFriendOrAny(playersAlive));
        } else {
          actions.set(action, this.pickEnemy(playersAlive));
        }
      }
    }
    return actions;
  }

  /** Sends this player to the graveyard, where they can't act or communicate */
  die() {
    this.place = Place.GRAVEYARD;
  }

  /** Select a foe to harm from a given list of targets */
  private pickEnemy(targets: Player[]): Player {
    const enemies = targets.filter(target => !this._friends.includes(target));
    if (enemies.length === 0) return this;
    const randomIndex = Math.floor(Math.random() * enemies.length);
    if (this._chats.length > 0) {
      const chat = this._chats[0];
      if (chat.vote) {
        if (enemies.includes(chat.vote)) {
          return chat.vote;
        }
      }
      chat.vote = enemies[randomIndex];
    }
    return enemies[randomIndex];
  }

  /** Pick a friendly player (including themselves) to help them */
  private pickFriendOrSelf(targets: Player[]): Player {
    const friends = targets.filter(target => this._friends.includes(target));
    if (friends.length === 0) return this;
    const randomIndex = Math.floor(Math.random() * friends.length);
    return friends[randomIndex];
  }

  /** Pick a player (except themselves) to help them. Priorizes friends. */
  private pickFriendOrAny(targets: Player[]): Player {
    const friends = targets.filter(target => this._friends.includes(target));
    if (friends.length === 0) {
      const randomIndex = Math.floor(Math.random() * targets.length);
      return targets[randomIndex];
    }
    const randomIndex = Math.floor(Math.random() * friends.length);
    return friends[randomIndex];
  }

  /** Adds this player to a group chat to coordinate with other players */
  chat(chat: Chat) {
    this._chats.push(chat);
  }
}
