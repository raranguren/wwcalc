import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TeamSelectorComponent} from "./components/team-selector.component";
import {ResultEstimationComponent} from "./components/result-estimation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TeamSelectorComponent, ResultEstimationComponent],
  template: `
    <h1>Werewolf <small>Calculator</small></h1>
    <div class="main">
      <app-team-selector></app-team-selector>
      <app-result-estimation></app-result-estimation>
    </div>
    <footer>wwcalc v1.12 - <a href="https://github.com/raranguren/wwcalc">Source</a></footer>
  `
})
export class AppComponent {
}
