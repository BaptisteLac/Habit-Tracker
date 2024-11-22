import {computed, inject, Injectable, signal} from '@angular/core';
import {StorageService} from "../storage/storage.service";
import {interval, Observable, Subject, takeUntil} from "rxjs";
import {TrainingProgress, TrainingSession, TrainingSettings} from "../../models/training.models";
import {TrainingStatus} from "../../enums/training-status";

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private storageService: StorageService = inject(StorageService)
  private destroy$: Subject<void> = new Subject<void>()
  private timer$: Observable<number> = interval(1000)

  private progress = signal<TrainingProgress>({
    currentRepetition: 0,
    remainingTime: 0,
    status: TrainingStatus.NONE,
  })
  public currentProgress = computed(() => this.progress());
  private settings = signal<TrainingSettings | null>(null);
  public currentSettings = computed(() => this.settings());
  private totalActiveTime = signal<number>(0);
  public currentTotalTime = computed(() => this.totalActiveTime());

  public startTraining(trainingSettings: TrainingSettings): void {
    this.destroy$.next();
    this.settings.set(trainingSettings)
    this.totalActiveTime.set(0)

    if (this.isValidSettings(trainingSettings)) {
      this.progress.set({
        currentRepetition: 1,
        remainingTime: trainingSettings.exerciseTime,
        status: TrainingStatus.PREPARING
      })

      setTimeout(() => this.startExercise(), 3000)
    }
  }

  private startExercise(): void {
    const current: TrainingProgress = this.progress();
    const newRemainingTime: number = current.remainingTime - 1;

    if (!this.settings()) {
      return
    }

    this.progress.set({
      ...this.progress(),
      status: TrainingStatus.EXERCISE
    })

    this.timer$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (current.status === 'exercise') {
        this.totalActiveTime.update(time => time + 1);
      }

      if (newRemainingTime <= 0) {
        if (current.currentRepetition >= this.settings()!.repetitions) {
          this.completeTraining()
        } else {
          this.startRest()
        }
      } else {
        this.progress.set({
          ...current,
          remainingTime: newRemainingTime
        })
      }
    })
  }

  private startRest(): void {
    const current: TrainingProgress = this.progress();
    const newRemainingTime: number = current.remainingTime - 1;

    if (!this.settings()) {
      return
    }

    this.progress.set({
      currentRepetition: this.progress().currentRepetition++,
      remainingTime: this.settings()!.restTime,
      status: TrainingStatus.REST
    })

    if (newRemainingTime <= 0) {
      if (current.currentRepetition >= this.settings()!.repetitions) {
        this.startExercise()
      }
    } else {
      this.progress.set({
        ...current,
        remainingTime: newRemainingTime
      })
    }
  }

  private completeTraining(): void {
    const session: TrainingSession = {
      exerciseTime: this.settings()!.exerciseTime,
      restTime: this.settings()!.restTime,
      repetitions: this.settings()!.repetitions,
      id: crypto.randomUUID(),
      date: new Date(),
      totalActiveTime: this.totalActiveTime(),
      completed: true
    }

    if (!this.settings()) {
      return
    }

    this.progress.set({
      ...this.progress(),
      status: TrainingStatus.COMPLETED
    })

    this.storageService.saveSession(session).subscribe();
    this.storageService.saveLastSettings(this.settings()!).subscribe()

    this.destroy$.next()
  }

  private isValidSettings(settings: TrainingSettings): boolean {
    return (
      settings.exerciseTime > 0 &&
      settings.restTime > 0 &&
      settings.repetitions > 0
    );
  }
}
