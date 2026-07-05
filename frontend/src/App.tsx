import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default App;
