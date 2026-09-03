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
    name: "João Pedro",
    handle: "@Joao-O-Mago-O-Mago",
    level: 🗿,
    levelTitle: "aspiring engineer and wizard",
    status: "in-game", // "online", "in-game", ou "offline"
    statusText: {
      pt: "Ponderando : conjecturando novos projetos",
      en: "pondering: conjecturing new projects"
    },
    avatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231b2838'/%3E%3Ccircle cx='50' cy='42' r='24' fill='%2366c0f4'/%3E%3Cellipse cx='50' cy='85' rx='36' ry='22' fill='%232a475e'/%3E%3C/svg%3E",
    bioQuote: {
      pt: "Tecnico mecatronico, aspirante à engenharia de controle e automação, com uma alta fixação em reinventar a roda, só que mais maneira e descolada.",
      en: "Mechatronics technician and aspiring control and automation engineer, with a strong fixation on reinventing the wheel, only cooler and trendier."
    }
  },

  // Redes Sociais exibidas no cabeçalho
  // Para adicionar ou ocultar uma rede, basta alterar 'visible: true/false' ou adicionar um novo item
  socials: [
    {
      name: "GitHub",
      icon: "assets/icons/github.svg",
      url: "https://github.com/JoaoOMago",
      visible: true
    },
    {
      name: "LinkedIn",
      icon: "assets/icons/linkedin.svg",
      url: "https://www.linkedin.com/in/jo%C3%A3o-pedro-gozzoli-b95641301/",
      visible: true
    },
    {
      name: "lattes",
      icon: "assets/icons/lattes.svg",
      url: "https://lattes.cnpq.br/",
      visible: true
    },
    {
      name: "X / Twitter",
      icon: "assets/icons/twitter.svg",
      url: "https://x.com/jpp12prado",
      visible: true
    },
    {
      name: "Email",
      icon: "assets/icons/email.svg",
      url: "mailto:joaopedrogozzoli@gmail.com",
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
