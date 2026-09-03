#!/usr/bin/env node

/**
 * ==============================================================================
 * build-index.js - Gerador Automático de Índice de Projetos
 * ==============================================================================
 * Varre a pasta /docs/assets/projetos, lê cada meta.json, detecta os idiomas
 * disponíveis (*.html) e atualiza /docs/data/projects-index.json.
 *
 * Modo de uso:
 *   node scripts/build-index.js
 *
 * Sem dependências externas! Usa apenas bibliotecas padrão do Node.js (fs, path).
 */

const fs = require("fs");
const path = require("path");

// Determina os caminhos base
const ROOT_DIR = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT_DIR, "docs", "assets", "projetos");
const OUTPUT_FILE = path.join(ROOT_DIR, "docs", "data", "projects-index.json");

console.log("\x1b[36m%s\x1b[0m", ">>> Iniciando varredura de projetos em:", PROJECTS_DIR);

if (!fs.existsSync(PROJECTS_DIR)) {
  console.error("\x1b[31m%s\x1b[0m", `[ERRO] Diretório de projetos não encontrado: ${PROJECTS_DIR}`);
  process.exit(1);
}

const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
const projects = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;

  const projectSlug = entry.name;
  const projectFolder = path.join(PROJECTS_DIR, projectSlug);
  const metaPath = path.join(projectFolder, "meta.json");

  if (!fs.existsSync(metaPath)) {
    console.warn("\x1b[33m%s\x1b[0m", `[AVISO] Ignorando pasta sem meta.json: ${projectSlug}`);
    continue;
  }

  try {
    const rawMeta = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(rawMeta);

    // Garante que o ID corresponde ao nome da pasta se não especificado
    if (!meta.id) {
      meta.id = projectSlug;
    }

    // Detecta automaticamente todos os arquivos de idioma (*.html) presentes na pasta
    const folderFiles = fs.readdirSync(projectFolder);
    const detectedLanguages = folderFiles
      .filter(f => f.endsWith(".html"))
      .map(f => path.basename(f, ".html"));

    if (detectedLanguages.length > 0) {
      meta.languages = detectedLanguages;
    }

    projects.push(meta);

    const statusBadge = meta.status === "hidden" ? "[OCULTO]" : "[VISÍVEL]";
    console.log(`  + Projeto detectado: \x1b[32m${meta.id}\x1b[0m ${statusBadge} (Idiomas: ${meta.languages?.join(", ") || "nenhum"})`);
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", `[ERRO] Falha ao processar ${metaPath}:`, err.message);
  }
}

// Ordena projetos por 'order' (crescente) ou por 'date' (decrescente)
projects.sort((a, b) => {
  if (a.order !== undefined && b.order !== undefined) {
    return a.order - b.order;
  }
  return new Date(b.date || 0) - new Date(a.date || 0);
});

// Garante que o diretório /docs/data existe
const dataDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Grava o arquivo formatado
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2), "utf-8");

console.log("\x1b[36m%s\x1b[0m", "\n>>> Sucesso! Índice de projetos atualizado em:");
console.log("\x1b[32m%s\x1b[0m", OUTPUT_FILE);
console.log(`Total de projetos indexados: ${projects.length} (${projects.filter(p => p.status !== "hidden").length} visíveis, ${projects.filter(p => p.status === "hidden").length} ocultos)\n`);
