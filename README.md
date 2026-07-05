# Crop Expert

**Live demo: [frontend-xi-nine-20.vercel.app](https://frontend-xi-nine-20.vercel.app)**
(API is hosted on Render's free tier, so the first prediction after a period of inactivity
can take ~50s while the server wakes up — everything after that is fast.)

Crop Expert is a full-stack plant leaf disease detector: upload a photo of a leaf and get an
instant diagnosis from a convolutional neural network. The production app is framed around
**potato leaf disease** (Healthy / Early Blight / Late Blight), but the underlying model was
trained on a broader 8-class PlantVillage subset covering Pepper, Potato, and Tomato — see
[The Model](#the-model) for exact numbers.

```
┌─────────────┐      photo       ┌──────────────┐      tensor       ┌───────────────┐
│  frontend/   │ ───────────────▶ │    api/      │ ─────────────────▶│  potatoes.h5  │
│ Vite + React │                  │  FastAPI     │                   │  (Keras CNN)  │
│ (browser UI) │ ◀─────────────── │ POST /predict│ ◀──────────────── │  inference    │
└─────────────┘   {class, conf.}  └──────────────┘   softmax scores  └───────────────┘
```

A browser can't run a Keras/TensorFlow model directly, so the architecture is split in two:
the frontend only handles upload/display, and `api/` is the sole piece of code that actually
loads the trained model and runs inference.

## The Model

### Dataset

Trained on a subset of the [PlantVillage dataset](https://www.kaggle.com/arjuntejaswi/plant-village)
covering three crops:

| Class | Images |
|---|---:|
| Pepper Bell — Bacterial Spot | 997 |
| Pepper Bell — Healthy | 1,478 |
| Potato — Early Blight | 1,000 |
| Potato — Late Blight | 1,000 |
| Potato — Healthy | 152 |
| Tomato — Target Spot | 1,404 |
| Tomato — Yellow Leaf Curl Virus | 3,209 |
| Tomato — Mosaic Virus | 373 |
| **Total** | **9,612** |

Loaded with `tf.keras.preprocessing.image_dataset_from_directory` and split 80% / 10% / 10%
into train / validation / test sets (batch size 32, shuffled with a fixed seed for
reproducibility).

> **Note:** `training/plants/` in this repo currently contains only the Potato subset (the
> Pepper and Tomato folders were removed to keep the repository small and focused on the
> shipped app's potato-only framing). The shipped model artifacts (`potatoes.h5`,
> `savedmodels/`) are unaffected — they were trained on the full 8-class dataset above.
> Re-running the notebook against the current `plants/` folder would train a *different*,
> Potato-only 3-class model, not reproduce the one that's deployed.

### Preprocessing & Augmentation

- **Resizing + Rescaling** (baked into the model as its first layer, so it also runs at
  inference time): resize to 256×256, rescale pixel values to `[0, 1]`.
- **Data augmentation** (training set only): random horizontal + vertical flip, random
  rotation (±20%).

### Architecture

A 6-block CNN, built with `tf.keras.Sequential`:

| Layer | Output shape | Params |
|---|---|---:|
| Resizing + Rescaling | 256×256×3 | 0 |
| Conv2D (32 filters, 3×3, ReLU) + MaxPool 2×2 | 127×127×32 | 896 |
| Conv2D (64, 3×3, ReLU) + MaxPool 2×2 | 62×62×64 | 18,496 |
| Conv2D (64, 3×3, ReLU) + MaxPool 2×2 | 30×30×64 | 36,928 |
| Conv2D (64, 3×3, ReLU) + MaxPool 2×2 | 14×14×64 | 36,928 |
| Conv2D (64, 3×3, ReLU) + MaxPool 2×2 | 6×6×64 | 36,928 |
| Conv2D (64, 3×3, ReLU) + MaxPool 2×2 | 2×2×64 | 36,928 |
| Flatten | 256 | 0 |
| Dense (64, ReLU) | 64 | 16,448 |
| Dense (softmax output) | 15 | 975 |
| **Total** | | **184,527** |

### Training Configuration

| | |
|---|---|
| Framework | TensorFlow / Keras 2.8 (originally trained) |
| Input | 256×256×3, batch size 32 |
| Optimizer | Adam |
| Loss | Sparse Categorical Crossentropy |
| Epochs | 3 (per the notebook's saved training history) |
| Split | 80% train / 10% validation / 10% test |

### Results

| Metric | Value |
|---|---|
| Test loss | 0.134 |
| Test accuracy | **94.9%** |

Measured on the held-out 10% test split across the full 8-class problem above.

### Known Limitations

- **Dead output units:** the notebook hardcodes `n_classes = 15` for the final Dense layer
  even though only 8 classes were ever trained — units 8–14 never receive gradient signal.
  The deployed API (`api/main.py`) defensively slices predictions to the first 8 (trained)
  classes before taking `argmax`, so this doesn't affect real predictions, but it's worth
  knowing if you extend the model.
- **Single split, no cross-validation:** the reported 94.9% is from one train/val/test split,
  not a cross-validated estimate.
- **Format compatibility:** `potatoes.h5` (Keras H5 format) is what the API loads. The
  `savedmodels/1` and `savedmodels/2` directories are the original TensorFlow SavedModel
  exports from the same training runs; Keras 3 (shipped with modern TensorFlow) dropped
  `load_model()` support for that legacy format, so those are kept for reference /
  TensorFlow-Serving use rather than loaded directly by the current API.

## Project Structure

```
.
├── api/                     # FastAPI backend — the only thing that runs the model
│   ├── main.py              # POST /predict endpoint, loads ../potatoes.h5
│   └── requirements.txt
├── frontend/                # Vite + React + TypeScript web app
│   └── src/
│       ├── components/      # Hero, DiagnosisPanel, UploadZone, SampleGallery, ResultCard...
│       ├── hooks/            # usePrediction — upload/predict state machine
│       └── lib/              # predict.ts (API client), diseaseInfo.ts (knowledge base)
├── training/
│   ├── potato-disease-classification-model.ipynb   # training notebook (source of truth)
│   ├── requirements.txt
│   └── plants/               # training images (Potato subset, see note above)
├── savedmodels/1, savedmodels/2   # versioned TensorFlow SavedModel exports
├── potatoes.h5               # the model the API actually loads
└── models.config             # TensorFlow-Serving model config (alternate deployment path)
```

## Setup for Python (API)

The API needs a real TensorFlow install, and TensorFlow does not support every Python
version (e.g. TF 2.8, pinned when this notebook was first trained, only supports up to
Python 3.11; newer TensorFlow releases top out around 3.12). If your system Python is newer
than that (check with `python3 --version`), install a compatible version first — e.g. on
macOS:

```bash
brew install python@3.11
```

Then create a virtualenv for the API and install its dependencies (a recent TensorFlow,
rather than the originally-pinned 2.8, since 2.8 predates native Apple Silicon wheels):

```bash
cd api
python3.11 -m venv .venv
source .venv/bin/activate   # .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Note: `api/main.py` loads `../potatoes.h5` (not the `savedmodels/` SavedModel directory) —
Keras 3, which ships with modern TensorFlow, dropped support for loading the legacy
SavedModel format via `load_model()`.

## Setup for the Frontend (Vite + React + TypeScript)

1. Install Node.js ([setup instructions](https://nodejs.org/en/download/package-manager/))
2. Install dependencies

```bash
cd frontend
npm install
```

3. Copy `.env.example` as `.env`.
4. Change `VITE_API_URL` in `.env` if the API isn't running on `http://localhost:8000`.

## Training the Model

1. Download the data from [Kaggle](https://www.kaggle.com/arjuntejaswi/plant-village).
2. Run Jupyter Notebook in your browser:

```bash
pip install -r training/requirements.txt
jupyter notebook
```

3. Open `training/potato-disease-classification-model.ipynb`.
4. Update the dataset path in the second cell to point at your downloaded data.
5. Run all cells. The notebook saves a versioned copy to `../savedmodels/<n>` and a Keras
   H5 copy to `../potatoes.h5`.

## Running the API

```bash
cd api
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0
```

The API is now running at `http://0.0.0.0:8000` (try `GET /ping`).

## Running the Frontend

```bash
cd frontend
npm run dev
```

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Vite, React 19, TypeScript, hand-rolled CSS design system (no UI framework) |
| Backend | FastAPI, Uvicorn |
| Model | TensorFlow / Keras CNN |
| Data | PlantVillage (Kaggle) |

## Future Scope

Potential next steps: an Android app for field use, cloud deployment (GCP/Render/Fly.io) for
a real public URL instead of local-only dev servers, and retraining a dedicated potato-only
model to match the app's current framing.
