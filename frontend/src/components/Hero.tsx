import { DiagnosisPanel } from './DiagnosisPanel';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__intro">
        <p className="hero__eyebrow">CNN-powered leaf diagnosis</p>
        <h1 className="hero__title">Spot potato blight before it spreads.</h1>
        <p className="hero__subtitle">
          Upload a photo of a potato leaf and get an instant read — Healthy, Early Blight, or Late
          Blight — from a convolutional neural network trained on thousands of real field images.
        </p>
        <ul className="hero__stats">
          <li>
            <strong>94.9%</strong>
            <span>test accuracy</span>
          </li>
          <li>
            <strong>9,612</strong>
            <span>training images</span>
          </li>
          <li>
            <strong>&lt;1s</strong>
            <span>per diagnosis</span>
          </li>
        </ul>
      </div>
      <DiagnosisPanel />
    </section>
  );
}
