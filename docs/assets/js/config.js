/**
 * ==============================================================================
 * Configuração Central do Portfólio Estilo Steam Profile
 * ==============================================================================
 * Edite este arquivo para personalizar seu perfil, redes sociais,
 * opacidade da coluna central e quais módulos deseja exibir no site.
 * Não é necessário alterar nenhum arquivo HTML ou CSS!
 */

window.PORTFOLIO_CONFIG = {
  // Opacidade do painel central (0.0 = totalmente transparente, 1.0 = sólido)
  // Controla a variável CSS --panel-opacity
  panelOpacity: 0.88,

  // Informações do Perfil (Estilo Steam)
  profile: {
    name: "Alex 'Vortex' Silva",
    handle: "@vortex_dev",
    level: 42,
    levelTitle: "Full-Stack & Game Developer",
    status: "in-game", // "online", "in-game", ou "offline"
    statusText: {
      pt: "Em jogo: Desenvolvendo Novos Projetos Incríveis",
      en: "In-Game: Crafting Next-Gen Web Experiences"
    },
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231b2838'/%3E%3Ccircle cx='50' cy='42' r='24' fill='%2366c0f4'/%3E%3Cellipse cx='50' cy='85' rx='36' ry='22' fill='%232a475e'/%3E%3C/svg%3E",
    bioQuote: {
      pt: "Engenheiro de Software focado em aplicações web modernas de alto desempenho, jogos e ferramentas interativas. Apaixonado pela cultura open-source e design imersivo.",
      en: "Software Engineer focused on high-performance web applications, game dev, and interactive tools. Passionate about open-source culture and immersive design."
    }
  },

  // Redes Sociais exibidas no cabeçalho
  // Para adicionar ou ocultar uma rede, basta alterar 'visible: true/false' ou adicionar um novo item
  socials: [
    {
      name: "GitHub",
      icon: "assets/icons/github.svg",
      url: "https://github.com",
      visible: true
    },
    {
      name: "LinkedIn",
      icon: "assets/icons/linkedin.svg",
      url: "https://linkedin.com",
      visible: true
    },
    {
      name: "Steam",
      icon: "assets/icons/steam.svg",
      url: "https://steamcommunity.com",
      visible: true
    },
    {
      name: "X / Twitter",
      icon: "assets/icons/twitter.svg",
      url: "https://x.com",
      visible: true
    },
    {
      name: "Email",
      icon: "assets/icons/email.svg",
      url: "mailto:contato@exemplo.com",
      visible: true
    }
  ],

  // Módulos da Página (seções que podem ser ativadas, desativadas e reordenadas)
  // Altere 'enabled' para ligar/desligar ou mude o 'order' para reorganizar a página
  modules: [
    { id: "hero", enabled: true, order: 1 },
    { id: "about", enabled: true, order: 2 },
    { id: "skills", enabled: true, order: 3 },
    { id: "projects", enabled: true, order: 4 },
    { id: "contact", enabled: true, order: 5 }
  ],

  // Dados para o Módulo de Habilidades / Inventário (Badges)
  skills: [
    { name: "JavaScript / TypeScript", level: "Nível 5 (Avançado)", category: "Frontend" },
    { name: "HTML5 & CSS3 Moderno", level: "Nível 5 (Expert)", category: "Frontend" },
    { name: "WebGL & Canvas", level: "Nível 4 (Proficiente)", category: "GameDev" },
    { name: "Node.js & APIs", level: "Nível 4 (Proficiente)", category: "Backend" },
    { name: "UI/UX & Steam Aesthetic", level: "Nível 5 (Expert)", category: "Design" },
    { name: "Git & GitHub Pages", level: "Nível 5 (Avançado)", category: "DevOps" }
  ],

  // Idioma padrão caso o navegador não informe ou não haja tradução
  defaultLanguage: "en",
  supportedLanguages: ["pt", "en"]
};
