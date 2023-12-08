import {Component, inject} from '@angular/core';
import {SimulationService} from "../services/simulation.service";
import {CommonModule} from "@angular/common";
import {Team} from "../models/team";

@Component({
  selector: 'app-result-estimation',
  standalone: true,
  imports: [
    CommonModule,
  ],

  template: `
    <h2>Estimated results</h2>
    <p>
        In a game involving <b>{{simulation.countPlayers()}}</b> players,
        where the objective is to identify
        <b>{{simulation.countEvil()}} wol{{simulation.countEvil() == 1 ? 'f' : 'ves'}}</b>
        among them,
        the estimated success rate is
        <b>{{simulation.winRate() | percent }}</b>
        (based on {{simulation.results().length}} simulations).
    </p>
    <p>
        Here is a forecast of the game duration:
    </p>
    <div class="stats-container">
        <div></div>
        <div class="stats-align-right stats-header-village">Village wins</div>
        <div class="stats-align-left stats-header-wolves">Wolves wins</div>
        @for (stat of simulation.stats(); track stat[0]) {
            <div class="stats-y-axis">
                {{stat[0]}} day{{stat[0] != 1 ? 's' : ''}}
            </div>
            <div class="stats-align-right">
                {{stat[1].get(Team.VILLAGE) | percent:'1.1'}}
                <span class="stats-bar-village" [style.min-width.em]="(stat[1].get(Team.VILLAGE)||0)*10"></span>
            </div>
            <div class="stats-align-left">
                <span class="stats-bar-wolves" [style.min-width.em]="(stat[1].get(Team.WOLVES)||0)*10"></span>
                {{stat[1].get(Team.WOLVES) | percent:'1.1'}}
            </div>
        } @empty {

        }
    </div>
  `
})
export class ResultEstimationComponent {

  simulation = inject(SimulationService);
  protected readonly Team = Team;
}
