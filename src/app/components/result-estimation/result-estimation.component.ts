import {Component, inject} from '@angular/core';
import {GameSimulator} from "../../services/game-simulator/game-simulator.service";
import {PercentPipe} from "@angular/common";
import {Team} from "../../models/team";

@Component({
  selector: 'app-result-estimation',
  standalone: true,
  imports: [
    PercentPipe,
  ],

  templateUrl: "./result-estimation.component.html",
})
export class ResultEstimationComponent {
  simulation = inject(GameSimulator);
  protected readonly Team = Team;
}
