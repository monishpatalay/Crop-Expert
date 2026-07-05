# Crop Expert — Frontend

A Vite + React + TypeScript app for diagnosing potato leaf disease (Healthy / Early Blight /
Late Blight) from a photo, using the CNN trained in `../training/potato-disease-classification-model.ipynb`
and served by `../api`.

## Setup

```bash
npm install
cp .env.example .env   # update VITE_API_URL if the API isn't on localhost:8000
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production (`dist/`)
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint

## Structure

- `src/components/` — UI components (`Hero`, `DiagnosisPanel`, `UploadZone`, `SampleGallery`, `ResultCard`, `ConfidenceMeter`, `HowItWorks`)
- `src/hooks/usePrediction.ts` — upload/predict state machine
- `src/lib/predict.ts` — API client for `POST /predict`
- `src/lib/diseaseInfo.ts` — disease knowledge base (labels, severity, advice) keyed by the API's class names
- `src/assets/samples/` — bundled sample leaf photos for the "try a sample" gallery
