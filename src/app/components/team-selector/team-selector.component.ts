import {Component, inject} from '@angular/core';
import {GameSimulator} from "../../services/game-simulator/game-simulator.service";
import {Game} from "../../models/game";
import {NumberInputComponent} from "../number-input/number-input.component";
import { TeamRolesComponent } from '../team-roles/team-roles.component';
import { Role } from '../../models/role';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
    NumberInputComponent,
    TeamRolesComponent,
  ],

  templateUrl: "team-selector.component.html",
})

export class TeamSelectorComponent {

  form = {
    players: 0,
    wolves: 0,
    guards: 0,
    healers: 0,
    princes: 0,
    masons: 0,
  };

  simulation = inject(GameSimulator)

  constructor() {
    const game = this.simulation.game();
    this.form.players = game.players;
    this.form.wolves = game.roleCount(Role.WEREWOLF);
    this.form.guards = game.roleCount(Role.GUARD);
    this.form.healers = game.roleCount(Role.HEALER);
    this.form.princes = game.roleCount(Role.PRINCE);
    this.form.masons = game.roleCount(Role.MASON);
  }

  onChange() {
    const players = this.form.players;
    const wolves = this.form.wolves;
    const guards = this.form.guards;
    const healers = this.form.healers;
    const princes = this.form.princes;
    const masons = this.form.masons;
    if (isNaN(players) || isNaN(wolves)) return;
    const game = new Game(players, [
      {role: Role.WEREWOLF, count: wolves},
      {role: Role.GUARD, count: guards},
      {role: Role.HEALER, count: healers},
      {role: Role.PRINCE, count: princes},
      {role: Role.MASON, count: masons},
    ]);
    this.simulation.restart(game);
  }

}
