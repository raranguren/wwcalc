import {Component, inject} from '@angular/core';
import {SimulationService} from "../../services/simulation/simulation.service";
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

  template: `
    <h2>Game setup</h2>
    <form class="bordered">
        <label for="players">Total number of players:</label>
        <app-number-input
                id="players"
                [value]="form.players"
                (valueChange)="form.players = $event; onChange()">
        </app-number-input>
        <label for="wolves">Number of wolves:</label>
        <app-number-input
                id="wolves"
                [value]="form.wolves"
                (valueChange)="form.wolves = $event; onChange()">
        </app-number-input>
        <label for="guards">Number of guards:</label>
        <app-number-input
                id="guards"
                [value]="form.guards"
                (valueChange)="form.guards = $event; onChange()">
        </app-number-input>
        <label for="healers">Number of healers:</label>
        <app-number-input
                id="healers"
                [value]="form.healers"
                (valueChange)="form.healers = $event; onChange()">
        </app-number-input>
    </form>
    <app-team-roles></app-team-roles>
    `
})

export class TeamSelectorComponent {

  form = {
    players: 0,
    wolves: 0,
    guards: 0,
    healers: 0,
  };

  simulation = inject(SimulationService)

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
