import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TeamSelectorComponent} from "./components/team-selector.component";
import {ResultEstimationComponent} from "./components/result-estimation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TeamSelectorComponent, ResultEstimationComponent],
  template: `
    <h1>Werewolf Calculator</h1>
    <app-team-selector></app-team-selector>
    <app-result-estimation></app-result-estimation>
  `
})
export class AppComponent {
}
