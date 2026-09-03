/**
 * ==============================================================================
 * lazy-media.js - Gerenciamento de Carregamento Sob Demanda de Mídias Pesadas
 * ==============================================================================
 * Garante que vídeos pesados e imagens de alta resolução NÃO sejam baixados
 * durante o carregamento inicial da página inicial (home).
 * As tags <video> são injetadas no DOM apenas ao abrir o projeto e destruídas
 * ao fechar para economizar banda e memória.
 */

window.LazyMedia = (function() {
  let imageObserver = null;

  /**
   * Inicializa o IntersectionObserver para imagens com data-src
   */
  function initImageObserver() {
    if ("IntersectionObserver" in window) {
      imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute("data-src");
            if (src) {
              img.src = src;
              img.removeAttribute("data-src");
            }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: "100px 0px" });
    }
  }

  /**
   * Registra imagens para lazy loading
   */
  function observeImages(container = document) {
    if (!imageObserver) {
      initImageObserver();
    }

    const lazyImages = container.querySelectorAll("img[data-src]");
    lazyImages.forEach(img => {
      if (imageObserver) {
        imageObserver.observe(img);
      } else {
        // Fallback imediato se o navegador for muito antigo
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      }
    });
  }

  /**
   * Injeta sob demanda uma tag <video> dentro do container especificado.
   * Chamado APENAS quando o usuário entra na visualização do projeto.
   *
   * @param {HTMLElement} container Elemento onde o vídeo será injetado
   * @param {string} videoSrc Caminho relativo do arquivo de vídeo
   * @param {string} posterSrc Caminho relativo da imagem de poster
   */
  function injectVideo(container, videoSrc, posterSrc = "") {
    if (!container || !videoSrc) return null;

    // Limpa qualquer mídia pré-existente
    destroyMedia(container);

    const videoEl = document.createElement("video");
    videoEl.controls = true;
    videoEl.preload = "metadata"; // Baixa apenas metadados iniciais ao abrir o projeto
    videoEl.playsInline = true;
    if (posterSrc) {
      videoEl.poster = posterSrc;
    }

    const sourceEl = document.createElement("source");
    sourceEl.src = videoSrc;

    // Detecta tipo de mídia básico pela extensão
    if (videoSrc.endsWith(".webm")) {
      sourceEl.type = "video/webm";
    } else if (videoSrc.endsWith(".mp4")) {
      sourceEl.type = "video/mp4";
    }

    videoEl.appendChild(sourceEl);
    container.appendChild(videoEl);

    return videoEl;
  }

  /**
   * Remove e destrói o elemento de vídeo, pausando a reprodução e
   * liberando conexões de rede e memória RAM.
   * Chamado ao fechar a visualização do projeto ou voltar à home.
   *
   * @param {HTMLElement} container Container da mídia
   */
  function destroyMedia(container) {
    if (!container) return;

    const videos = container.querySelectorAll("video");
    videos.forEach(v => {
      try {
        v.pause();
        v.removeAttribute("src");
        // Remove sources filhas
        while (v.firstChild) {
          v.removeChild(v.firstChild);
        }
        v.load(); // Força o descarte do buffer de vídeo no navegador
      } catch (e) {
        console.warn("Aviso ao pausar vídeo:", e);
      }
      v.remove();
    });

    container.innerHTML = "";
  }

  return {
    observeImages,
    injectVideo,
    destroyMedia
  };
})();
