import {Component, inject} from '@angular/core';
import {SimulationService} from "../services/simulation.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-result-estimation',
  standalone: true,
  imports: [
    CommonModule,
  ],

  template: `
    <h2>Estimated results</h2>
    {{simulation.countPlayers()}} players need to find
    {{simulation.countEvil()}} wol{{simulation.countEvil() == 1 ? 'f' : 'ves'}} among them.
    <br>
    <b>Win rate:</b> {{simulation.winRate() | percent }} ({{simulation.results().length}} simulations)
  `
})
export class ResultEstimationComponent {

  simulation = inject(SimulationService);
}
