import { Component, Input } from "@angular/core";
import { Role } from "../models/role";

@Component({
  selector: 'app-role-icon',
  standalone: true,

  template: `
    <div class="role-cell" [class]="cssClass()">{{ text() }}</div>
  `,
})

export class RoleIconComponent {
  @Input() value: Role = Role.VILLAGER;

  text() {
    switch (this.value) {
        case Role.GUARD: return "g";
        case Role.HEALER: return "h";
        case Role.VILLAGER: return "";
        case Role.WEREWOLF: return "W";
        default: return "?";
    }
  }

  cssClass() {
    switch (this.value) {
        case Role.WEREWOLF: return "role-icon-wolves";
        default: return "role-icon-village"
    }
  }
}