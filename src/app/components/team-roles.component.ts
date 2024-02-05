import { Component, computed, inject } from "@angular/core";
import { SimulationService } from "../services/simulation.service";
import { RoleIconComponent } from "./role-icon.component";

@Component({
  selector: 'app-team-roles',
  standalone: true,
  imports: [
    RoleIconComponent,
  ],

  template: `
    <h2>Role distribution</h2>
    <div class="bordered auto-arrange-icons">
      @for (role of roles(); track role) {
        <app-role-icon [value]="role"></app-role-icon>
      } @empty {
        Invalid setup
      }
    </div>
  `,
})
export class TeamRolesComponent {
  simulation = inject(SimulationService);

  roles = computed(() => {
    return this.simulation.game().roles;
  });

}