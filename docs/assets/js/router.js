/**
 * ==============================================================================
 * router.js - Gerenciador de Rotas Internas via Hash (#/ e #/projeto/<slug>)
 * ==============================================================================
 */

window.Router = (function() {
  const routes = {};
  let currentRoute = null;
  let previousScrollPosition = 0;

  /**
   * Registra um manipulador para uma rota ou padrão
   */
  function addRoute(pattern, handler) {
    routes[pattern] = handler;
  }

  /**
   * Navega programaticamente para um hash
   */
  function navigate(hash) {
    window.location.hash = hash.startsWith("#") ? hash : `#${hash}`;
  }

  /**
   * Processa a mudança de rota atual
   */
  function handleRoute() {
    const rawHash = window.location.hash || "#/";
    const cleanHash = rawHash.replace(/^#/, "") || "/";

    // Rota inicial / Home
    if (cleanHash === "/" || cleanHash === "") {
      if (routes["home"]) {
        routes["home"]();
      }
      return;
    }

    // Rota de Projeto: /projeto/<slug>
    const projectMatch = cleanHash.match(/^\/projeto\/([a-zA-Z0-9_-]+)/);
    if (projectMatch && projectMatch[1]) {
      const slug = projectMatch[1];
      if (routes["project"]) {
        routes["project"](slug);
      }
      return;
    }

    // Rota desconhecida: redireciona para home
    navigate("#/");
  }

  /**
   * Salva a posição de rolagem antes de abrir um projeto
   */
  function saveScroll() {
    previousScrollPosition = window.scrollY || document.documentElement.scrollTop;
  }

  /**
   * Restaura a posição de rolagem após fechar um projeto
   */
  function restoreScroll() {
    window.scrollTo({
      top: previousScrollPosition,
      behavior: "smooth"
    });
  }

  /**
   * Inicializa o roteador escutando o evento 'hashchange'
   */
  function init() {
    window.addEventListener("hashchange", handleRoute);
    // Dispara a rota atual no carregamento da página
    handleRoute();
  }

  return {
    addRoute,
    navigate,
    init,
    saveScroll,
    restoreScroll
  };
})();
