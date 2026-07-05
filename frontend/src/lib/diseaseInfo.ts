export type Severity = 'healthy' | 'moderate' | 'severe' | 'unknown';

export interface DiseaseInfo {
  label: string;
  crop: string;
  severity: Severity;
  summary: string;
  advice: string[];
}

// Keyed by the raw class strings returned by the API (api/main.py CLASS_NAMES),
// which mirror dataset.class_names from the training notebook.
const KNOWLEDGE_BASE: Record<string, DiseaseInfo> = {
  Potato___healthy: {
    label: 'Healthy',
    crop: 'Potato',
    severity: 'healthy',
    summary: 'No signs of blight — this leaf looks healthy.',
    advice: [
      'Keep monitoring weekly, especially after rain.',
      'Maintain good plant spacing for airflow.',
      'Rotate crops each season to limit soil-borne inoculum.',
    ],
  },
  Potato___Early_blight: {
    label: 'Early Blight',
    crop: 'Potato',
    severity: 'moderate',
    summary:
      'Caused by Alternaria solani. Shows up as dark, concentric "target-spot" lesions on older leaves.',
    advice: [
      'Remove and destroy infected leaves and debris.',
      'Apply a labeled fungicide (e.g. chlorothalonil) on a rotation.',
      'Avoid overhead irrigation — water at the base of the plant.',
    ],
  },
  Potato___Late_blight: {
    label: 'Late Blight',
    crop: 'Potato',
    severity: 'severe',
    summary:
      'Caused by Phytophthora infestans — the pathogen behind the Irish Potato Famine. Spreads fast in cool, wet weather.',
    advice: [
      'Act quickly: this can damage a field within days.',
      'Remove and destroy infected plants; do not compost them.',
      'Apply a protective fungicide and avoid overhead watering.',
    ],
  },
};

export function formatClassName(raw: string): string {
  return raw.replace(/_+/g, ' ').trim();
}

export function getDiseaseInfo(rawClass: string): DiseaseInfo {
  const known = KNOWLEDGE_BASE[rawClass];
  if (known) {
    return known;
  }

  const [crop] = rawClass.split(/_+/);
  return {
    label: formatClassName(rawClass),
    crop: formatClassName(crop ?? 'Unknown'),
    severity: 'unknown',
    summary: "This doesn't look like a potato leaf — the model detected something else instead.",
    advice: ['Try a clear, well-lit photo of a single potato leaf for a reliable diagnosis.'],
  };
}
