import {Component, inject} from '@angular/core';
import {SimulationService} from "../services/simulation.service";
import {Game} from "../models/game";

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
  ],

  template: `
    <h2>Game setup</h2>
    <form (change)="onChange()">
      <div>
        <label>Number of players:</label>
        <input #players type="number" [value]="form.players" (input)="form.players = players.value">
      </div>
      <div>
        <label for="wolves">Number of wolves:</label>
        <input #wolves type="number" [value]="form.wolves" (input)="form.wolves = wolves.value">
      </div>
      <div>
          <label for="guards">Number of guards:</label>
          <input #guards type="number" [value]="form.guards" (input)="form.guards = guards.value">
      </div>
    </form>
  `
})

export class TeamSelectorComponent {

  form = {
    players: '',
    wolves: '',
    guards: '',
  };

  simulation = inject(SimulationService)

  constructor() {
    const game = this.simulation.game();
    this.form.players = '' + game.players;
    this.form.wolves = '' + game.wolves;
    this.form.guards = '' + game.guards;
  }

  onChange() {
    const players = Number.parseInt(this.form.players);
    const wolves = Number.parseInt(this.form.wolves);
    const guards = Number.parseInt(this.form.guards);
    if (isNaN(players) || isNaN(wolves)) return;
    const game = new Game(players, wolves, guards);
    this.simulation.start(game);
  }

}
