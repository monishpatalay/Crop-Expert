const SIZE = 88;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  value: number;
};

export function ConfidenceMeter({ value }: Props) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const offset = CIRCUMFERENCE * (1 - clamped);

  return (
    <div
      className="confidence-meter"
      role="img"
      aria-label={`Model confidence ${Math.round(clamped * 100)} percent`}
    >
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={STROKE}
        />
        <circle
          className="confidence-meter__arc"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <span className="confidence-meter__value">{Math.round(clamped * 100)}%</span>
    </div>
  );
}
