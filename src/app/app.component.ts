import {Component} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonicModule, RouterOutlet, RouterLink],
  standalone: true
})
export class AppComponent {
}
