import { Component } from "@angular/core";
import { version } from "../../../package.json";

@Component({
  selector: 'app-footer',
  standalone: true,

  template: `
    <footer>wwcalc v{{ VERSION }} - <a [href]="REPO_URL" target="_blank">Source code</a></footer>
  `,
})
export class FooterComponent {
    VERSION = version;
    REPO_URL = "https://github.com/raranguren/wwcalc";
}