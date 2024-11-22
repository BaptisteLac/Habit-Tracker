import {TrainingStatus} from "../enums/training-status";

export interface TrainingSettings {
  exerciseTime: number;
  restTime: number;
  repetitions: number
}

export interface TrainingSession extends TrainingSettings {
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

export interface TrainingProgress {
  currentRepetition: number;
  remainingTime: number;
  status: TrainingStatus;
}
