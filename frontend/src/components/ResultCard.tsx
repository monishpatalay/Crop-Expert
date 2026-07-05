import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';
import { ConfidenceMeter } from './ConfidenceMeter';
import { getDiseaseInfo } from '../lib/diseaseInfo';
import type { Prediction } from '../types';
import type { Severity } from '../lib/diseaseInfo';

type Props = {
  prediction: Prediction;
};

const SEVERITY_ICON: Record<Severity, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  moderate: AlertTriangle,
  severe: AlertTriangle,
  unknown: HelpCircle,
};

export function ResultCard({ prediction }: Props) {
  const info = getDiseaseInfo(prediction.class);
  const Icon = SEVERITY_ICON[info.severity];

  return (
    <div className={`result-card result-card--${info.severity}`}>
      <div className="result-card__header">
        <Icon size={22} aria-hidden="true" />
        <div>
          <p className="result-card__crop">{info.crop}</p>
          <h3 className="result-card__label">{info.label}</h3>
        </div>
        <ConfidenceMeter value={prediction.confidence} />
      </div>
      <p className="result-card__summary">{info.summary}</p>
      <ul className="result-card__advice">
        {info.advice.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
