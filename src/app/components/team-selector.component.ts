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
    </form>
  `
})

export class TeamSelectorComponent {

  form = {
    players: '10',
    wolves: '2',
  };

  simulation = inject(SimulationService)

  onChange() {
    const players = Number.parseInt(this.form.players);
    const wolves = Number.parseInt(this.form.wolves);
    if (isNaN(players) || isNaN(wolves)) return;
    const game = new Game(players, wolves);
    this.simulation.start(game);
  }

}
