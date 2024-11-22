import {Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, switchMap, tap} from "rxjs";
import {TrainingSession, TrainingSettings, TrainingStatsGlobal} from "../../models/training.models";
import {Preferences} from "@capacitor/preferences";
import {StorageKeys} from "../../enums/storage-keys.enums";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private lastSettings$: BehaviorSubject<TrainingSettings | null> = new BehaviorSubject<TrainingSettings | null>(null)
  private sessions$: BehaviorSubject<TrainingSession[]> = new BehaviorSubject<TrainingSession[]>([])
  private stats$: BehaviorSubject<TrainingStatsGlobal> = new BehaviorSubject<TrainingStatsGlobal>({
    totalMinutes: 0,
    totalSessions: 0,
    lastTrainingDate: new Date()
  });

  constructor() {
    this.initializeStorage().subscribe()
  }

  public getLastSettings(): Observable<TrainingSettings | null> {
    return this.lastSettings$.asObservable();
  }

  public getSessions(): Observable<TrainingSession[]> {
    return this.sessions$.asObservable();
  }

  public getStats(): Observable<TrainingStatsGlobal> {
    return this.stats$.asObservable();
  }

  public saveLastSettings(settings: TrainingSettings): Observable<void> {
    return from(Preferences.set({
      key: StorageKeys.LAST_SETTINGS,
      value: JSON.stringify(settings)
    }))
      .pipe(
        tap(() => this.lastSettings$.next(settings)),
        map(() => void 0)
      );
  }

  public saveSession(session: TrainingSession): Observable<void> {
    const updatedSessions: TrainingSession[] = [...this.sessions$.value, session];
    const updatedStats = this.calculateUpdatedStats(session)

    return from(Preferences.set({
      key: StorageKeys.SESSIONS,
      value: JSON.stringify(updatedSessions)
    }))
      .pipe(
        tap(() => this.sessions$.next(updatedSessions)),
        switchMap(() => from(Preferences.set({
          key: StorageKeys.STATS,
          value: JSON.stringify(updatedStats)
        }))),
        tap(() => this.stats$.next(updatedStats)),
        map(() => void 0)
      )
  }

  private initializeStorage(): Observable<void> {
    return from(Preferences.get({key: StorageKeys.LAST_SETTINGS})).pipe(
      tap(({value}) => {
        if (value) {
          this.lastSettings$.next(JSON.parse(value));
        }
      }),
      switchMap(() => from(Preferences.get({key: StorageKeys.SESSIONS}))),
      tap(({value}) => {
        if (value) {
          this.sessions$.next(JSON.parse(value));
        }
      }),
      switchMap(() => from(Preferences.get({key: StorageKeys.STATS}))),
      tap(({value}) => {
        if (value) {
          this.stats$.next(JSON.parse(value));
        }
      }),
      map(() => void 0)
    );
  }

  private calculateUpdatedStats(newSession: TrainingSession): TrainingStatsGlobal {
    const currentStats = this.stats$.value

    return {
      totalMinutes: currentStats.totalMinutes + (newSession.totalActiveTime / 60),
      totalSessions: currentStats.totalSessions + 1,
      lastTrainingDate: newSession.date
    }
  }

}
