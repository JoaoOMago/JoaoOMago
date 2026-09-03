/**
 * ==============================================================================
 * projects-loader.js - Descoberta e Carregamento Modular de Projetos
 * ==============================================================================
 * Lê data/projects-index.json, filtra projetos ocultos, ordena, renderiza o
 * feed e cuida da abertura sob demanda dos detalhes do projeto.
 */

window.ProjectsLoader = (function() {
  let allProjects = [];
  let currentOpenProject = null;

  /**
   * Busca o índice de projetos em data/projects-index.json
   */
  async function fetchProjectsIndex() {
    try {
      const response = await fetch("data/projects-index.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      allProjects = Array.isArray(data) ? data : (data.projects || []);
      return allProjects;
    } catch (err) {
      console.error("Erro ao carregar data/projects-index.json:", err);
      return [];
    }
  }

  /**
   * Filtra projetos visíveis e ordena por 'order' (crescente) ou 'date' (decrescente)
   */
  function getVisibleProjects() {
    return allProjects
      .filter(p => p.status === "visible" || p.status === "published" || !p.status)
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
  }

  /**
   * Renderiza a grade de projetos (Feed da Home)
   */
  function renderFeed(containerId = "projects-feed-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const visibleProjects = getVisibleProjects();
    const currentLang = window.I18N.getLanguage();

    if (visibleProjects.length === 0) {
      container.innerHTML = `<div class="steam-showcase-box"><p>${window.I18N.t("no_content_available")}</p></div>`;
      return;
    }

    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "projects-feed";

    visibleProjects.forEach(proj => {
      const title = proj.title?.[currentLang] || proj.title?.["en"] || proj.title?.["pt"] || proj.name || proj.id;
      const summary = proj.summary?.[currentLang] || proj.summary?.["en"] || proj.summary?.["pt"] || "";
      const cover = proj.cover || "assets/icons/globe.svg";
      const tags = Array.isArray(proj.tags) ? proj.tags : [];
      const hasVideo = Boolean(proj.video || proj.hasVideo);

      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${window.I18N.t("view_project")}: ${title}`);

      // Click no card abre a rota do projeto
      card.addEventListener("click", () => {
        window.Router.saveScroll();
        window.Router.navigate(`#/projeto/${proj.id}`);
      });

      // Suporte a teclado (Enter / Space)
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.Router.saveScroll();
          window.Router.navigate(`#/projeto/${proj.id}`);
        }
      });

      card.innerHTML = `
        <div class="project-card-media">
          <img class="project-card-cover" data-src="${cover}" alt="${title}" loading="lazy" />
          ${hasVideo ? `<span class="project-card-badge">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            ${window.I18N.t("video_badge")}
          </span>` : ""}
        </div>
        <div class="project-card-body">
          ${proj.date ? `<div class="project-card-date">${proj.date}</div>` : ""}
          <h3 class="project-card-title">${title}</h3>
          <p class="project-card-summary">${summary}</p>
          <div class="project-card-tags">
            ${tags.map(tag => `<span class="project-tag">${tag}</span>`).join("")}
          </div>
          <div class="project-card-footer">
            <span class="btn-steam-view">
              ${window.I18N.t("view_project")} &rarr;
            </span>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    container.appendChild(grid);

    // Ativa o carregamento preguiçoso das capas
    window.LazyMedia.observeImages(container);
  }

  /**
   * Abre e renderiza a visualização detalhada do projeto sob demanda
   */
  async function openProjectDetail(slug) {
    const project = allProjects.find(p => p.id === slug);
    const modalBackdrop = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-project-title");
    const modalMedia = document.getElementById("modal-project-media");
    const modalContent = document.getElementById("modal-project-content");
    const modalTags = document.getElementById("modal-project-tags");
    const modalLinks = document.getElementById("modal-project-links");

    if (!modalBackdrop || !project) {
      console.warn("Projeto não encontrado ou modal ausente:", slug);
      window.Router.navigate("#/");
      return;
    }

    currentOpenProject = project;
    const currentLang = window.I18N.getLanguage();
    const title = project.title?.[currentLang] || project.title?.["en"] || project.title?.["pt"] || project.id;

    if (modalTitle) modalTitle.textContent = title;

    // Renderiza tags
    if (modalTags) {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      modalTags.innerHTML = tags.map(tag => `<span class="project-tag">${tag}</span>`).join("");
    }

    // Renderiza links (demo, repo)
    if (modalLinks) {
      let linksHtml = "";
      if (project.demoUrl) {
        linksHtml += `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="social-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
          ${window.I18N.t("demo_link")}
        </a>`;
      }
      if (project.repoUrl) {
        linksHtml += `<a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="social-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          ${window.I18N.t("repo_link")}
        </a>`;
      }
      modalLinks.innerHTML = linksHtml;
    }

    // 1. Injeção de Mídia Sob Demanda (Vídeo ou Galeria de Imagens)
    if (modalMedia) {
      window.LazyMedia.destroyMedia(modalMedia); // Limpa mídia anterior

      if (project.video) {
        // Injeta a tag <video> APENAS aqui
        window.LazyMedia.injectVideo(modalMedia, project.video, project.cover || "");
      } else if (project.cover) {
        const img = document.createElement("img");
        img.src = project.cover;
        img.alt = title;
        modalMedia.appendChild(img);
      }
    }

    // 2. Busca o conteúdo HTML no idioma adequado com fallback
    if (modalContent) {
      modalContent.innerHTML = `<p style="color: var(--color-text-dim);">${window.I18N.t("loading_content")}</p>`;
      const projectBaseUrl = `assets/projetos/${project.id}`;
      const { html } = await window.I18N.fetchProjectContentWithFallback(projectBaseUrl, project.languages || []);
      modalContent.innerHTML = html;
    }

    // Abre o modal na interface
    modalBackdrop.classList.add("is-open");
    modalBackdrop.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Evita scroll de fundo
  }

  /**
   * Fecha o modal do projeto e descarta as mídias pesadas
   */
  function closeProjectDetail() {
    const modalBackdrop = document.getElementById("project-modal");
    const modalMedia = document.getElementById("modal-project-media");

    if (modalMedia) {
      // Importante: destrói a tag de vídeo para descarregar o buffer da memória
      window.LazyMedia.destroyMedia(modalMedia);
    }

    if (modalBackdrop) {
      modalBackdrop.classList.remove("is-open");
      setTimeout(() => {
        modalBackdrop.classList.add("hidden");
      }, 250);
    }

    document.body.style.overflow = "";
    currentOpenProject = null;
  }

  /**
   * Atualiza visualização aberta caso o idioma tenha mudado
   */
  function onLanguageSwitched() {
    // Re-renderiza o feed
    renderFeed();

    // Se houver modal aberto, recarrega o projeto no novo idioma
    if (currentOpenProject) {
      openProjectDetail(currentOpenProject.id);
    }
  }

  return {
    fetchProjectsIndex,
    renderFeed,
    openProjectDetail,
    closeProjectDetail,
    onLanguageSwitched,
    getCurrentOpenProject: () => currentOpenProject
  };
})();
