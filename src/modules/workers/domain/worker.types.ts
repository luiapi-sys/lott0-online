export interface WorkerIntervals {
  audit: number;
  optimize: number;
  consolidate: number;
}

export const DEFAULT_WORKER_INTERVALS: WorkerIntervals = {
  audit: 270,
  optimize: 3600,
  consolidate: 86400,
};

export interface WorkerStatus {
  active: string[];
  running: string[];
}
