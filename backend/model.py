"""
Chargement et inférence du modèle DistilBERT fine-tuné.
Régression continue : prédit une valeur entre -1 (anti-vaccin) et +1 (pro-vaccin).
"""

import os
import torch
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "best_distilbert.pt")
BASE_MODEL  = "distilbert-base-uncased"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer    = None
model        = None
model_loaded = False


def load_model():
    global tokenizer, model, model_loaded

    path = os.path.abspath(MODEL_PATH)
    if not os.path.exists(path):
        raise RuntimeError(
            f"Fichier introuvable : {path}\n"
            "Veuillez uploader best_distilbert.pt à la racine du projet."
        )

    print(f"[model] Chargement depuis {path} sur {device}...")
    tokenizer = DistilBertTokenizerFast.from_pretrained(BASE_MODEL)
    model     = DistilBertForSequenceClassification.from_pretrained(BASE_MODEL, num_labels=1)

    state_dict = torch.load(path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    model_loaded = True
    print("[model] Chargé avec succès.")


def predict(text: str) -> float:
    """Retourne un score continu entre -1 et +1."""
    if not model_loaded:
        load_model()

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding=True,
    ).to(device)

    with torch.no_grad():
        score = model(**inputs).logits.squeeze().item()

    return float(max(-1.0, min(1.0, score)))


def predict_batch(texts: list) -> list:
    """Retourne une liste de scores pour plusieurs textes."""
    if not model_loaded:
        load_model()

    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        max_length=128,
        padding=True,
    ).to(device)

    with torch.no_grad():
        scores = model(**inputs).logits.squeeze().tolist()

    if isinstance(scores, float):
        scores = [scores]

    return [float(max(-1.0, min(1.0, s))) for s in scores]


# Tentative de chargement au démarrage du serveur
try:
    load_model()
except RuntimeError as e:
    print(f"[model] Avertissement : {e}")
