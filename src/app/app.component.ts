import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TeamSelectorComponent} from "./components/team-selector.component";
import {ResultEstimationComponent} from "./components/result-estimation.component";
import { FooterComponent } from './components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    TeamSelectorComponent, 
    ResultEstimationComponent, 
    FooterComponent,
  ],
  template: `
    <h1>Werewolf <small>Calculator</small></h1>
    <div class="main">
      <app-team-selector></app-team-selector>
      <app-result-estimation></app-result-estimation>
    </div>
    <app-footer></app-footer>
  `
})
export class AppComponent {
}
