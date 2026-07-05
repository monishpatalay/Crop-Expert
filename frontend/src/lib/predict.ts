import type { Prediction } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/predict';

export async function predictLeaf(file: File): Promise<Prediction> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}`);
  }

  return response.json();
}
