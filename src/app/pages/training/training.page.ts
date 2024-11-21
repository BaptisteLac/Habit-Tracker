import {Component, inject, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {TrainingFormComponent} from "../../components/training-form/training-form.component";
import {StorageService} from "../../services/storage/storage.service";
import {TrainingSettings} from "../../models/training.models";

@Component({
  selector: 'app-training',
  templateUrl: './training.page.html',
  styleUrls: ['./training.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TrainingFormComponent
  ]
})
export class TrainingPage implements OnInit {
  private readonly storageService = inject(StorageService)

  public ngOnInit() {
    this.storageService.getLastSettings()
  }

  public onStartTraining(settings: TrainingSettings) {
    this.storageService.saveLastSettings(settings).subscribe()
  }
}
