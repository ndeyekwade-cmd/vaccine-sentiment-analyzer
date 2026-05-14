# ═══════════════════════════════════════════════════════════
#  VaccineSentiment Analyzer — Dockerfile HuggingFace Spaces
#  Port d'exposition : 7860
# ═══════════════════════════════════════════════════════════

FROM python:3.10-slim

# ── Installer Node.js 18 ────────────────────────────────────
RUN apt-get update && apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Copier l'ensemble du projet ─────────────────────────────
COPY . .

# ── Build du frontend React ─────────────────────────────────
RUN cd frontend && npm install && npm run build

# ── Copier le build dans backend/static/ ───────────────────
RUN mkdir -p backend/static && cp -r frontend/build/. backend/static/

# ── Installer les dépendances Python ───────────────────────
RUN pip install --no-cache-dir -r backend/requirements.txt

# ── Exposer le port HuggingFace Spaces ─────────────────────
EXPOSE 7860

# ── Lancer FastAPI (sert aussi les fichiers React statiques)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
