import { useCallback, useState } from 'react';
import { predictLeaf } from '../lib/predict';
import type { Prediction, PredictionStatus } from '../types';

interface UsePredictionResult {
  status: PredictionStatus;
  preview: string | null;
  prediction: Prediction | null;
  error: string | null;
  submit: (file: File) => void;
  reset: () => void;
}

export function usePrediction(): UsePredictionResult {
  const [status, setStatus] = useState<PredictionStatus>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback((file: File) => {
    setStatus('uploading');
    setError(null);
    setPrediction(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    predictLeaf(file)
      .then((result) => {
        setPrediction(result);
        setStatus('success');
      })
      .catch(() => {
        setError("Couldn't reach the diagnosis service. Is the API running?");
        setStatus('error');
      });
  }, []);

  const reset = useCallback(() => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setPrediction(null);
    setError(null);
    setStatus('idle');
  }, []);

  return { status, preview, prediction, error, submit, reset };
}
