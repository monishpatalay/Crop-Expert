from io import BytesIO
from pathlib import Path

import numpy as np
import tensorflow as tf
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
MODEL = tf.keras.models.load_model(BASE_DIR.parent / "potatoes.h5", compile=False)

# Matches dataset.class_names from training/potato-disease-classification-model.ipynb.
# The model's output layer has 15 units (a leftover from the notebook's hardcoded
# n_classes=15), but only these 8 were ever trained on, so predictions are sliced
# to this length before argmax.
CLASS_NAMES = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato__Target_Spot",
    "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus",
]


@app.get("/ping")
async def ping():
    return "Hello, I am alive"


def read_file_as_image(data: bytes) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    return np.array(image)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch, verbose=0)[0][: len(CLASS_NAMES)]

    predicted_class = CLASS_NAMES[int(np.argmax(predictions))]
    confidence = float(np.max(predictions))
    return {
        "class": predicted_class,
        "confidence": confidence,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
