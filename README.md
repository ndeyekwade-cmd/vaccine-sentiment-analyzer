---
title: Vaccine Sentiment Analyzer
emoji: 💉
colorFrom: red
colorTo: white
sdk: docker
app_port: 7860
---

# VaccineSentiment Analyzer

Analyse de sentiment de tweets relatifs aux vaccins COVID-19 — AIMS Sénégal 2026.

**Compétition** : Zindi "To Vaccinate or Not to Vaccinate"  
**Modèle** : DistilBERT fine-tuné en régression (`num_labels=1`)  
**Labels** : `-1` anti-vaccin · `0` neutre · `+1` pro-vaccin

## Équipe

- Ndeye Khady Wade
- Maimouna Ndoye
- Soukeyna Touré

## Stack

Backend · FastAPI + PyTorch + HuggingFace Transformers  
Frontend · React 18  
Déploiement · HuggingFace Spaces (Docker)

## Lancement local

**Backend**

    cd vaccine-sentiment-app
    pip install -r backend/requirements.txt
    uvicorn backend.main:app --reload --port 8000

**Frontend** (dans un autre terminal)

    cd vaccine-sentiment-app/frontend
    npm install
    npm start

> Placez `best_distilbert.pt` à la racine de `vaccine-sentiment-app/` avant de démarrer.

## Fichiers à uploader manuellement

| Fichier | Destination |
|---|---|
| `best_distilbert.pt` | racine du projet |
| `group-photo.jpg` | `frontend/public/` |
| `aims-logo.png` | `frontend/public/` |

## API

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | État du serveur + modèle chargé |
| POST | `/predict` | `{"text": "..."}` → score + sentiment |
| POST | `/predict-batch` | `{"texts": [...]}` → liste de résultats |
