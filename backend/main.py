"""
API FastAPI — VaccineSentiment Analyzer
AIMS Sénégal · NLP Project 2026
Endpoints : GET /health · POST /predict · POST /predict-batch
"""

import os
import sys

# Permet l'import de model.py que ce soit via 'uvicorn backend.main:app' ou 'uvicorn main:app'
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

import model as sentiment_model

app = FastAPI(
    title="VaccineSentiment API",
    description="Analyse de sentiment de tweets vaccins — AIMS Sénégal 2026",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Schémas ──────────────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    text: str

class PredictBatchRequest(BaseModel):
    texts: List[str]


# ─── Helper ───────────────────────────────────────────────────────────────────

def classify(score: float):
    """Convertit un score continu en étiquette de sentiment."""
    if score < -0.3:
        return "Négatif", -1
    elif score <= 0.3:
        return "Neutre", 0
    else:
        return "Positif", 1


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": sentiment_model.model_loaded}


@app.post("/predict")
def predict(req: PredictRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Le texte ne peut pas être vide.")
    try:
        score = sentiment_model.predict(req.text)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    sentiment, label = classify(score)
    return {
        "score":      round(score, 4),
        "sentiment":  sentiment,
        "confidence": round(abs(score) * 100),
        "label":      label,
    }


@app.post("/predict-batch")
def predict_batch(req: PredictBatchRequest):
    if not req.texts:
        raise HTTPException(status_code=400, detail="La liste de textes est vide.")
    try:
        scores = sentiment_model.predict_batch(req.texts)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    results = []
    for text, score in zip(req.texts, scores):
        sentiment, label = classify(score)
        results.append({
            "text":       text,
            "score":      round(score, 4),
            "sentiment":  sentiment,
            "confidence": round(abs(score) * 100),
            "label":      label,
        })
    return {"results": results}


# ─── Fichiers statiques React (build de production) ──────────────────────────
_static = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(_static):
    app.mount("/", StaticFiles(directory=_static, html=True), name="static")
