import {Component, inject} from '@angular/core';
import {GameSimulator} from "../../services/game-simulator/game-simulator.service";
import {Game} from "../../models/game";
import {NumberInputComponent} from "../number-input/number-input.component";
import { TeamRolesComponent } from '../team-roles/team-roles.component';

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
  };

  simulation = inject(GameSimulator)

  constructor() {
    const game = this.simulation.game();
    this.form.players = game.players;
    this.form.wolves = game.wolves;
    this.form.guards = game.guards;
    this.form.healers = game.healers;
  }

  onChange() {
    const players = this.form.players;
    const wolves = this.form.wolves;
    const guards = this.form.guards;
    const healers = this.form.healers;
    if (isNaN(players) || isNaN(wolves)) return;
    const game = new Game(players, wolves, guards, healers);
    this.simulation.restart(game);
  }

}
