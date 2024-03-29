import { Component } from '@angular/core';
import {TeamSelectorComponent} from "./components/team-selector/team-selector.component";
import {ResultEstimationComponent} from "./components/result-estimation/result-estimation.component";
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TeamSelectorComponent, 
    ResultEstimationComponent, 
    FooterComponent,
  ],
  template: `
    <h1>Werewolf <small>Balance Calculator</small></h1>
    <div class="main">
      <app-team-selector></app-team-selector>
      <app-result-estimation></app-result-estimation>
    </div>
    <app-footer></app-footer>
  `
})
export class AppComponent {
}
