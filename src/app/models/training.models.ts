export interface TrainingSettings {
  exerciseTime: number;
  restTime: number;
  repetitions: number
}

export interface TraingSession extends TrainingSettings {
  id: string;
  date: Date;
  totalActiveTime: number;
  completed: boolean;
}

export interface TrainingStatsGlobal {
  totalMinutes: number;
  totalSessions: number;
  lastTrainingDate: Date
}

export type TrainingStatus = 'none | preparing | exercise | rest | completed'

export interface TrainingProgress {
  currentRepetition: number;
  remainingTime: number;
  status: TrainingStatus;
}
