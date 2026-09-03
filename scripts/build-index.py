#!/usr/bin/env python3
"""
build-index.py - Gerador Automático de Índice de Projetos (Alternativa Python)
Varre /docs/assets/projetos, lê cada meta.json e gera /docs/data/projects-index.json.
Uso:
  python scripts/build-index.py
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_DIR = os.path.join(BASE_DIR, "docs", "assets", "projetos")
OUTPUT_FILE = os.path.join(BASE_DIR, "docs", "data", "projects-index.json")

print(f">>> [Python] Iniciando varredura em: {PROJECTS_DIR}")

if not os.path.exists(PROJECTS_DIR):
    print(f"[ERRO] Diretório de projetos não existe: {PROJECTS_DIR}")
    sys.exit(1)

projects = []

for entry in sorted(os.listdir(PROJECTS_DIR)):
    folder = os.path.join(PROJECTS_DIR, entry)
    if not os.path.isdir(folder):
        continue

    meta_path = os.path.join(folder, "meta.json")
    if not os.path.exists(meta_path):
        print(f"[AVISO] Ignorando pasta sem meta.json: {entry}")
        continue

    try:
        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)

        if not meta.get("id"):
            meta["id"] = entry

        # Detecta arquivos de idioma (*.html)
        languages = [
            os.path.splitext(f)[0]
            for f in os.listdir(folder)
            if f.endswith(".html")
        ]
        if languages:
            meta["languages"] = languages

        projects.append(meta)
        status = "[OCULTO]" if meta.get("status") == "hidden" else "[VISÍVEL]"
        print(f"  + Projeto: {meta['id']} {status} (Idiomas: {', '.join(meta.get('languages', []))})")
    except Exception as e:
        print(f"[ERRO] Falha ao processar {meta_path}: {e}")

# Ordenação por order ou data
def sort_key(p):
    order = p.get("order")
    if order is not None:
        return (0, order)
    return (1, p.get("date", ""))

projects.sort(key=sort_key)

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print(f"\n>>> Sucesso! Índice gravado em: {OUTPUT_FILE}")
visible_count = len([p for p in projects if p.get("status") != "hidden"])
hidden_count = len([p for p in projects if p.get("status") == "hidden"])
print(f"Total: {len(projects)} projetos ({visible_count} visíveis, {hidden_count} ocultos)")
