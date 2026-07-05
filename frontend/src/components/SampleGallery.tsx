import earlyBlight1 from '../assets/samples/early-blight-1.jpg';
import earlyBlight2 from '../assets/samples/early-blight-2.jpg';
import lateBlight1 from '../assets/samples/late-blight-1.jpg';
import lateBlight2 from '../assets/samples/late-blight-2.jpg';
import healthy1 from '../assets/samples/healthy-1.jpg';
import healthy2 from '../assets/samples/healthy-2.jpg';

const SAMPLES = [
  { src: earlyBlight1, label: 'Early blight example leaf' },
  { src: lateBlight1, label: 'Late blight example leaf' },
  { src: healthy1, label: 'Healthy example leaf' },
  { src: earlyBlight2, label: 'Early blight example leaf' },
  { src: lateBlight2, label: 'Late blight example leaf' },
  { src: healthy2, label: 'Healthy example leaf' },
];

type Props = {
  onSelect: (file: File) => void;
  disabled?: boolean;
};

export function SampleGallery({ onSelect, disabled }: Props) {
  const handleClick = async (src: string) => {
    if (disabled) return;
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], 'sample-leaf.jpg', { type: blob.type || 'image/jpeg' });
    onSelect(file);
  };

  return (
    <div className="sample-gallery">
      <p className="sample-gallery__label">No leaf handy? Try a sample:</p>
      <ul className="sample-gallery__list">
        {SAMPLES.map((sample, index) => (
          <li key={`${sample.src}-${index}`}>
            <button
              type="button"
              className="sample-gallery__item"
              onClick={() => handleClick(sample.src)}
              disabled={disabled}
              aria-label={sample.label}
            >
              <img src={sample.src} alt={sample.label} loading="lazy" width={56} height={56} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
