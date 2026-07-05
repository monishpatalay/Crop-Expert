import { ImageOff, Loader2, RotateCcw } from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';
import { UploadZone } from './UploadZone';
import { SampleGallery } from './SampleGallery';
import { ResultCard } from './ResultCard';

export function DiagnosisPanel() {
  const { status, preview, prediction, error, submit, reset } = usePrediction();
  const isBusy = status === 'uploading';

  return (
    <div className="diagnosis-panel" id="diagnose">
      <div className="diagnosis-panel__grid">
        <div className="diagnosis-panel__stage">
          {preview ? (
            <div className="diagnosis-panel__preview">
              <img src={preview} alt="Uploaded potato leaf" />
              {isBusy && (
                <div className="diagnosis-panel__loading">
                  <Loader2 className="spin" size={28} aria-hidden="true" />
                  <span>Analyzing leaf…</span>
                </div>
              )}
            </div>
          ) : (
            <UploadZone onFileSelected={submit} disabled={isBusy} />
          )}

          {preview && (
            <button type="button" className="diagnosis-panel__reset" onClick={reset}>
              <RotateCcw size={16} aria-hidden="true" />
              Try another photo
            </button>
          )}
        </div>

        <div className="diagnosis-panel__result">
          {status === 'success' && prediction && <ResultCard prediction={prediction} />}

          {status === 'error' && (
            <div className="diagnosis-panel__error">
              <ImageOff size={22} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {status === 'idle' && (
            <div className="diagnosis-panel__placeholder">
              <p>Upload or pick a sample leaf to see a diagnosis here.</p>
            </div>
          )}

          {status === 'uploading' && (
            <div className="diagnosis-panel__placeholder">
              <p>Running the CNN model…</p>
            </div>
          )}
        </div>
      </div>

      {!preview && <SampleGallery onSelect={submit} disabled={isBusy} />}
    </div>
  );
}
