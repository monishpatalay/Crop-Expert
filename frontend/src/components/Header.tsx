import { Sprout } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__brand">
        <Sprout size={22} aria-hidden="true" />
        <span>Crop Expert</span>
      </div>
      <a
        className="site-header__link"
        href="https://www.kaggle.com/arjuntejaswi/plant-village"
        target="_blank"
        rel="noopener noreferrer"
      >
        Dataset credit
      </a>
    </header>
  );
}
