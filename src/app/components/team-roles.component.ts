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
      @for (role of roles(); track $index) {
        <app-role-icon [role]="role"></app-role-icon>
      } @empty {
        No players
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