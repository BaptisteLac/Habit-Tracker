import {Component, computed, inject, output, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TrainingSettings} from "../../models/training.models";
import {StorageService} from "../../services/storage/storage.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonicModule
  ],
  standalone: true
})
export class TrainingFormComponent {
  public startTraining = output<TrainingSettings>()
  public trainingForm = new FormGroup({
    exerciseTime: new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(300)]),
    restTime: new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(300)]),
    repetitions: new FormControl<number>(0, [Validators.required, Validators.min(1), Validators.max(20)]),
  })
  protected exerciseTimeInvalid: Signal<boolean> = computed(() => this.trainingForm.get('exerciseTime')?.errors?.['required'] && this.trainingForm.get('exerciseTime')?.touched)
  protected restTimeInvalid: Signal<boolean> = computed(() => this.trainingForm.get('restTime')?.errors?.['required'] && this.trainingForm.get('restTime')?.touched)
  protected repetitionsInvalid: Signal<boolean> = computed(() => this.trainingForm.get('repetitions')?.errors?.['required'] && this.trainingForm.get('repetitions')?.touched)
  private readonly serviceStorage = inject(StorageService)

  constructor() {
    this.serviceStorage.getLastSettings().pipe(
      takeUntilDestroyed(),
    ).subscribe(
      (settings: TrainingSettings | null) => settings && this.trainingForm.patchValue(settings)
    )
  }

  public onSubmit(): void {
    if (this.trainingForm.valid) {
      this.startTraining.emit(this.trainingForm.value as TrainingSettings)
    }
  }

}
