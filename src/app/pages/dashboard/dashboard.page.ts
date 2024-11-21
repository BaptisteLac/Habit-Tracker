import {Component} from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class DashboardPage {
}
