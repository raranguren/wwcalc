import {Component, inject} from '@angular/core';
import {SimulationService} from "../../services/simulation/simulation.service";
import {PercentPipe} from "@angular/common";
import {Team} from "../../models/team";

@Component({
  selector: 'app-result-estimation',
  standalone: true,
  imports: [
    PercentPipe,
  ],

  template: `
    <h2>Estimated results</h2>
    <p>
        In this game involving <b>{{simulation.countPlayers()}}</b> players,
        where the objective is to identify
        <b>{{simulation.countEvil()}} wol{{simulation.countEvil() === 1 ? 'f' : 'ves'}}</b>
        among them,
        @if (simulation.game().guards > 0 || simulation.game().healers > 0) {
            with the help of special powers,
        }
        the estimated success rate is
        <b>{{simulation.winRate() | percent }}</b>
        (based on {{simulation.results().length}} simulations).
    </p>
    <p>
        Here is a forecast of the game duration:
    </p>
    <div class="stats-container">
        <div></div>
        <div class="stats-align-right stats-header-village">Good wins</div>
        <div class="stats-align-left stats-header-wolves">Evil wins</div>
        @for (stat of simulation.stats(); track stat[0]) {
            <div class="stats-y-axis">
                {{stat[0]}} day{{stat[0] !== 1 ? 's' : ''}}
            </div>
            <div class="stats-align-right">
                @if (stat[1].get(Team.VILLAGE)) {
                    {{stat[1].get(Team.VILLAGE) | percent:'1.1'}}
                }
                <span class="stats-bar-village" [style.min-width.vh]="(stat[1].get(Team.VILLAGE)||0)*20"></span>
            </div>
            <div class="stats-align-left">
                <span class="stats-bar-wolves" [style.min-width.vh]="(stat[1].get(Team.WOLVES)||0)*20"></span>
                @if (stat[1].get(Team.WOLVES)) {
                    {{stat[1].get(Team.WOLVES) | percent:'1.1'}}
                }
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
