export type PredictionStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface Prediction {
  class: string;
  confidence: number;
}
