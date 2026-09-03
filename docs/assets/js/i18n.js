/**
 * ==============================================================================
 * i18n.js - Internacionalização com Detecção Automática e Sistema de Fallback
 * ==============================================================================
 */

window.I18N = (function() {
  const STORAGE_KEY = "steam_portfolio_preferred_lang";

  // Dicionário de traduções da interface de usuário
  const translations = {
    pt: {
      site_title: "Perfil de Joao Pedro",
      level: "Nível",
      online: "Online",
      in_game: "Em jogo",
      offline: "Offline",
      section_showcase: "Destaque do Perfil",
      section_skills: "Insígnias & Habilidades Técnicas",
      section_projects: "Vitrine de Projetos",
      section_contact: "Mural de Contato & Recados",
      projects_count: "Projetos em Exibição",
      view_project: "Ver Detalhes",
      play_video: "Assistir Vídeo",
      back_to_feed: "Voltar ao Início",
      close_modal: "Fechar",
      technologies_used: "Tecnologias & Ferramentas:",
      demo_link: "Acessar Demonstração",
      repo_link: "Código Fonte",
      send_message: "Enviar E-mail",
      connect_linkedin: "Conectar no LinkedIn",
      view_github: "Ver Repositórios no GitHub",
      no_content_available: "Conteúdo não disponível neste idioma para este projeto.",
      footer_text: "Desenvolvido com Vanilla HTML/CSS/JS. Hospedado no GitHub Pages.",
      badge_level_prefix: "Nível",
      items_count: "itens",
      welcome_title: "Bem-vindo(a) ao meu perfil interativo!",
      showcase_explore: "Explore a vitrine abaixo para conhecer projetos recentes em produção, demonstrações interativas e experimentos criativos com WebGL, áudio e desenvolvimento web moderno.",
      contact_intro: "Quer conversar sobre uma oportunidade, propor um projeto ou tirar dúvidas? Conecte-se comigo diretamente:",
      open_channel: "Abrir canal",
      video_badge: "Vídeo",
      loading_content: "Carregando conteúdo..."
    },
    en: {
      site_title: "João Pedro's Profile",
      level: "Level",
      online: "Online",
      in_game: "In-Game",
      offline: "Offline",
      section_showcase: "Profile Showcase",
      section_skills: "Badges & Tech Arsenal",
      section_projects: "Featured Projects Showcase",
      section_contact: "Contact Board & Comments",
      projects_count: "Projects Displayed",
      view_project: "View Details",
      play_video: "Watch Video",
      back_to_feed: "Back to Feed",
      close_modal: "Close",
      technologies_used: "Technologies & Tools:",
      demo_link: "Launch Live Demo",
      repo_link: "Source Code",
      send_message: "Send Email",
      connect_linkedin: "Connect on LinkedIn",
      view_github: "View GitHub Repositories",
      no_content_available: "Content not available in this language for this project.",
      footer_text: "Built with Vanilla HTML/CSS/JS. Hosted on GitHub Pages.",
      badge_level_prefix: "Level",
      items_count: "items",
      welcome_title: "Welcome to my interactive profile!",
      showcase_explore: "Explore the showcase below to discover recent production projects, interactive demos, and creative experiments featuring WebGL, audio, and modern web development.",
      contact_intro: "Want to discuss an opportunity, propose a project, or just chat? Feel free to reach out directly:",
      open_channel: "Open channel",
      video_badge: "Video",
      loading_content: "Loading content..."
    }
  };

  const listeners = [];

  /**
   * Detecta o melhor idioma inicial
   */
  function detectInitialLanguage() {
    // 1. Preferência salva anteriormente
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) {
      return saved;
    }

    // 2. Idioma do navegador
    const browserLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (browserLang.startsWith("pt")) {
      return "pt";
    }

    // 3. Fallback padrão em inglês
    return window.PORTFOLIO_CONFIG?.defaultLanguage || "en";
  }

  let currentLang = detectInitialLanguage();

  /**
   * Retorna o idioma ativo atual ("pt" ou "en")
   */
  function getLanguage() {
    return currentLang;
  }

  /**
   * Define manualmente o idioma e persiste
   */
  function setLanguage(lang) {
    if (!translations[lang]) {
      lang = "en";
    }
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn("Não foi possível salvar preferência de idioma no localStorage", e);
    }

    // Atualiza o atributo lang do HTML
    document.documentElement.lang = lang;

    // Dispara eventos para os módulos re-renderizarem
    notifyListeners(lang);
  }

  /**
   * Retorna texto traduzido para a chave informada
   */
  function t(key, fallback = "") {
    return translations[currentLang]?.[key] || translations["en"]?.[key] || fallback || key;
  }

  /**
   * Registra um callback para quando o idioma mudar
   */
  function onLanguageChange(fn) {
    if (typeof fn === "function") {
      listeners.push(fn);
    }
  }

  function notifyListeners(lang) {
    listeners.forEach(fn => {
      try {
        fn(lang);
      } catch (err) {
        console.error("Erro no callback de idioma:", err);
      }
    });
  }

  /**
   * Algoritmo central de fallback para carregar o conteúdo HTML de um projeto:
   * 1. Idioma atualmente selecionado (ex: pt.html)
   * 2. Se não existir, tentar inglês (en.html)
   * 3. Se não existir, tentar português (pt.html)
   * 4. Se não existir, usar qualquer versão de idioma disponível informada em meta.languages
   * 5. Se não existir nenhum, retornar erro amigável.
   *
   * @param {string} projectBaseUrl Ex: "assets/projetos/cyber-strike"
   * @param {Array<string>} availableLanguages Ex: ["pt", "en"]
   * @returns {Promise<{html: string, resolvedLang: string}>}
   */
  async function fetchProjectContentWithFallback(projectBaseUrl, availableLanguages = []) {
    const candidates = [];

    // 1. Idioma ativo
    candidates.push(currentLang);

    // 2. Inglês (en)
    if (!candidates.includes("en")) candidates.push("en");

    // 3. Português (pt)
    if (!candidates.includes("pt")) candidates.push("pt");

    // 4. Qualquer outro idioma disponível no meta.json
    if (Array.isArray(availableLanguages)) {
      availableLanguages.forEach(l => {
        if (!candidates.includes(l)) candidates.push(l);
      });
    }

    for (const langCode of candidates) {
      const url = `${projectBaseUrl}/${langCode}.html`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const html = await response.text();
          return { html, resolvedLang: langCode };
        }
      } catch (e) {
        // Continua para o próximo candidato
      }
    }

    // 5. Fallback final amigável se nenhum arquivo de idioma foi encontrado
    return {
      html: `<div class="project-empty-state">
              <p>${t("no_content_available")}</p>
             </div>`,
      resolvedLang: null
    };
  }

  return {
    getLanguage,
    setLanguage,
    t,
    onLanguageChange,
    fetchProjectContentWithFallback,
    supportedLanguages: Object.keys(translations)
  };
})();
