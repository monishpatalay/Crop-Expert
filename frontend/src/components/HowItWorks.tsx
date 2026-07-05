import { Camera, ClipboardCheck, Cpu } from 'lucide-react';

const STEPS = [
  {
    icon: Camera,
    title: 'Capture',
    body: 'Take or upload a clear photo of a single potato leaf, front side up.',
  },
  {
    icon: Cpu,
    title: 'Analyze',
    body: 'A 6-layer CNN resizes, normalizes, and scores the leaf against learned disease patterns.',
  },
  {
    icon: ClipboardCheck,
    title: 'Diagnose',
    body: 'Get a label, a confidence score, and plain-language next steps for your field.',
  },
];

export function HowItWorks() {
  return (
    <section className="how-it-works">
      <h2>How it works</h2>
      <ol className="how-it-works__list">
        {STEPS.map((step) => (
          <li key={step.title}>
            <step.icon size={24} aria-hidden="true" />
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
