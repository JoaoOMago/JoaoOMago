/**
 * ==============================================================================
 * app.js - Bootstrap e Orquestração da Aplicação do Portfólio
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  const config = window.PORTFOLIO_CONFIG || {};

  // 1. Aplica a opacidade configurada na variável CSS --panel-opacity
  if (config.panelOpacity !== undefined) {
    document.documentElement.style.setProperty("--panel-opacity", config.panelOpacity);
  }

  // 2. Constrói o Seletor de Idiomas no Topo
  renderLanguageSwitcher();

  // 3. Renderiza os Módulos da Página de acordo com a ordem e visibilidade no config.js
  renderModules();

  // 4. Carrega o Índice de Projetos e renderiza o feed inicial
  await window.ProjectsLoader.fetchProjectsIndex();
  window.ProjectsLoader.renderFeed();

  // 5. Configura o Modal de Detalhes de Projetos
  setupModalEvents();

  // 6. Configura o Roteador Interno via Hash
  setupRouter();

  // 7. Registra ouvinte para re-renderizar textos ao alternar idioma
  window.I18N.onLanguageChange(() => {
    updateUiTexts();
    window.ProjectsLoader.onLanguageSwitched();
  });
});

/**
 * Renderiza os botões do seletor de idioma na barra do topo
 */
function renderLanguageSwitcher() {
  const container = document.getElementById("lang-selector-container");
  if (!container) return;

  const currentLang = window.I18N.getLanguage();
  container.innerHTML = `
    <div class="lang-selector" role="radiogroup" aria-label="Language Selector">
      <button class="lang-btn ${currentLang === 'pt' ? 'active' : ''}" data-lang="pt" aria-label="Português">
        🇧🇷 PT
      </button>
      <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="English">
        🇺🇸 EN
      </button>
    </div>
  `;

  container.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-lang");
      window.I18N.setLanguage(selected);
      container.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

/**
 * Renderiza os módulos configurados em window.PORTFOLIO_CONFIG.modules
 * respeitando a flag 'enabled' e a ordem 'order'
 */
function renderModules() {
  const mainContainer = document.getElementById("steam-profile-modules");
  if (!mainContainer) return;

  const config = window.PORTFOLIO_CONFIG || {};
  const modules = Array.isArray(config.modules) ? [...config.modules] : [];

  // Filtra e ordena
  const activeModules = modules
    .filter(m => m.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  mainContainer.innerHTML = "";

  activeModules.forEach(mod => {
    const section = document.createElement("section");
    section.id = `module-${mod.id}`;
    section.className = "profile-module";

    switch (mod.id) {
      case "hero":
        section.innerHTML = buildHeroModuleHtml(config);
        break;
      case "about":
        section.innerHTML = buildAboutModuleHtml(config);
        break;
      case "skills":
        section.innerHTML = buildSkillsModuleHtml(config);
        break;
      case "projects":
        section.innerHTML = buildProjectsModuleHtml();
        break;
      case "contact":
        section.innerHTML = buildContactModuleHtml(config);
        break;
      default:
        console.warn(`Módulo desconhecido: ${mod.id}`);
        return;
    }

    mainContainer.appendChild(section);
  });
}

/**
 * Constrói o HTML do Módulo Hero / Steam Header
 */
function buildHeroModuleHtml(config) {
  const prof = config.profile || {};
  const currentLang = window.I18N.getLanguage();
  const quote = prof.bioQuote?.[currentLang] || prof.bioQuote?.["en"] || prof.bioQuote?.["pt"] || "";
  const statusText = prof.statusText?.[currentLang] || prof.statusText?.["en"] || prof.statusText?.["pt"] || "Online";

  // Renderiza as redes sociais visíveis
  const socials = Array.isArray(config.socials) ? config.socials.filter(s => s.visible !== false) : [];
  const socialsHtml = socials.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="${s.name}">
      <img src="${s.icon}" alt="" width="16" height="16" />
      <span>${s.name}</span>
    </a>
  `).join("");

  return `
    <div class="steam-header-wrap">
      <div class="steam-header-banner"></div>
      <div class="steam-header-content">
        <div class="steam-avatar-box is-online">
          <img class="steam-avatar-img" src="${prof.avatar}" alt="${prof.name}" />
        </div>

        <div class="steam-user-meta">
          <div class="steam-user-title-row">
            <h1 class="steam-username">${prof.name}</h1>
            <span class="steam-user-handle">${prof.handle}</span>
          </div>

          <div class="steam-status-row">
            <span class="steam-status-dot"></span>
            <span class="steam-status-label">${statusText}</span>
          </div>

          <div class="steam-user-quote">${quote}</div>

          <div class="steam-socials-bar">
            ${socialsHtml}
          </div>
        </div>

        <div class="steam-user-level-col">
          <div class="steam-level-badge">
            <span class="steam-level-circle">${prof.level || 50}</span>
            <span>${window.I18N.t("level")}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--color-badge-gold);">${prof.levelTitle || ""}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Constrói o HTML do Módulo About / Showcase Box
 */
function buildAboutModuleHtml(config) {
  const prof = config.profile || {};
  const currentLang = window.I18N.getLanguage();
  const bio = prof.bioQuote?.[currentLang] || prof.bioQuote?.["en"] || prof.bioQuote?.["pt"] || "";

  return `
    <header class="module-header">
      <h2 class="module-title">${window.I18N.t("section_showcase")}</h2>
    </header>
    <div class="steam-showcase-box">
      <p style="font-size: 1.05rem; margin-bottom: 12px; color: #ffffff;">
        Bem-vindo(a) ao meu perfil interativo!
      </p>
      <p>${bio}</p>
      <p style="margin-top: 10px; color: var(--color-text-muted);">
        Explore a vitrine abaixo para conhecer projetos recentes em produção, demonstrações interativas e experimentos criativos com WebGL, áudio e desenvolvimento web moderno.
      </p>
    </div>
  `;
}

/**
 * Constrói o HTML do Módulo de Habilidades / Badges
 */
function buildSkillsModuleHtml(config) {
  const skills = Array.isArray(config.skills) ? config.skills : [];
  const skillsHtml = skills.map(skill => `
    <div class="skill-badge-item">
      <div class="skill-badge-icon">&lt;/&gt;</div>
      <div class="skill-badge-info">
        <span class="skill-badge-name">${skill.name}</span>
        <span class="skill-badge-level">${skill.level}</span>
      </div>
    </div>
  `).join("");

  return `
    <header class="module-header">
      <h2 class="module-title">${window.I18N.t("section_skills")}</h2>
      <span class="module-badge-counter">${skills.length} ${window.I18N.t("items_count")}</span>
    </header>
    <div class="skills-grid">
      ${skillsHtml}
    </div>
  `;
}

/**
 * Constrói o HTML do Módulo de Projetos
 */
function buildProjectsModuleHtml() {
  return `
    <header class="module-header">
      <h2 class="module-title">${window.I18N.t("section_projects")}</h2>
    </header>
    <div id="projects-feed-container"></div>
  `;
}

/**
 * Constrói o HTML do Módulo de Contato
 */
function buildContactModuleHtml(config) {
  const socials = Array.isArray(config.socials) ? config.socials.filter(s => s.visible !== false) : [];

  return `
    <header class="module-header">
      <h2 class="module-title">${window.I18N.t("section_contact")}</h2>
    </header>
    <div class="contact-comment-box">
      <p style="color: var(--color-text-main);">
        Quer conversar sobre uma oportunidade, propor um projeto ou tirar dúvidas? Conecte-se comigo diretamente:
      </p>
      <div class="contact-direct-grid">
        ${socials.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="contact-card-link">
            <img src="${s.icon}" alt="" width="20" height="20" />
            <div>
              <strong style="display: block; font-size: 0.95rem;">${s.name}</strong>
              <span style="font-size: 0.8rem; color: var(--color-accent-blue);">Abrir canal &rarr;</span>
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

/**
 * Configura os ouvintes de evento do Modal de Detalhes
 */
function setupModalEvents() {
  const modalBackdrop = document.getElementById("project-modal");
  const btnClose = document.getElementById("btn-close-modal");

  if (btnClose) {
    btnClose.addEventListener("click", () => {
      window.Router.navigate("#/");
    });
  }

  // Clicar fora da caixa de diálogo fecha o modal
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        window.Router.navigate("#/");
      }
    });
  }

  // Tecla Escape fecha o modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop && modalBackdrop.classList.contains("is-open")) {
      window.Router.navigate("#/");
    }
  });
}

/**
 * Configura o roteador cliente
 */
function setupRouter() {
  window.Router.addRoute("home", () => {
    window.ProjectsLoader.closeProjectDetail();
    window.Router.restoreScroll();
  });

  window.Router.addRoute("project", (slug) => {
    window.ProjectsLoader.openProjectDetail(slug);
  });

  window.Router.init();
}

/**
 * Atualiza dinamicamente os textos da interface após mudança de idioma
 */
function updateUiTexts() {
  renderModules();
  window.ProjectsLoader.renderFeed();
}
