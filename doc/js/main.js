/**
 * SCADA Core - Estação de Reabastecimento de Hidrogênio
 * Controlador Principal: Tema, Simulador SCADA, Mimico SVG, Alarmes e GitHub API
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Alternância de Tema (Dark / Light) com LocalStorage
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'h2scada_theme_pref';

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    // Padrão dark theme conforme solicitado
    const activeTheme = saved ? saved : 'dark';

    if (activeTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    updateThemeButtons(activeTheme);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    themeToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const nextTheme = isCurrentlyDark ? 'light' : 'dark';

        if (nextTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }

        localStorage.setItem(STORAGE_KEY, nextTheme);
        updateThemeButtons(nextTheme);
      });
    });
  }

  function updateThemeButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle');
    buttons.forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro');
    });
  }

  // --------------------------------------------------------------------------
  // 2. Menu Mobile Hambúrguer
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-nav-menu');

    if (!hamburgerBtn || !mobileMenu) return;

    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Tooltip Flutuante dos Sensores (SVG)
  // --------------------------------------------------------------------------
  let tooltipEl = null;

  function ensureTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.getElementById('custom-tooltip');
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'custom-tooltip';
        tooltipEl.className = 'custom-tooltip';
        tooltipEl.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltipEl);
      }
    }
    return tooltipEl;
  }

  function showTooltip(e, text) {
    const tooltip = ensureTooltip();
    if (!text || !tooltip) return;

    const parts = text.split('|');
    if (parts.length > 1) {
      const title = parts[0].trim();
      const items = parts.slice(1).map(p => `<div>• ${p.trim()}</div>`).join('');
      tooltip.innerHTML = `<strong style="color: var(--primary-light); display: block; margin-bottom: 3px;">${title}</strong>${items}`;
    } else {
      tooltip.textContent = text;
    }

    tooltip.classList.add('is-visible');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    if (!tooltipEl || !tooltipEl.classList.contains('is-visible')) return;

    const offset = 16;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    const rect = tooltipEl.getBoundingClientRect();
    if (x + rect.width > window.innerWidth - 16) {
      x = e.clientX - rect.width - offset;
    }
    if (y + rect.height > window.innerHeight - 16) {
      y = e.clientY - rect.height - offset;
    }

    tooltipEl.style.left = `${Math.max(10, x)}px`;
    tooltipEl.style.top = `${Math.max(10, y)}px`;
  }

  function hideTooltip() {
    if (tooltipEl) {
      tooltipEl.classList.remove('is-visible');
    }
  }

  function attachTooltips() {
    ensureTooltip();
    const targets = document.querySelectorAll('[data-sensor]');
    targets.forEach(el => {
      const info = el.getAttribute('data-sensor');
      el.addEventListener('mouseenter', (e) => showTooltip(e, info));
      el.addEventListener('mousemove', positionTooltip);
      el.addEventListener('mouseleave', hideTooltip);
      el.addEventListener('focus', (e) => showTooltip(e, info));
      el.addEventListener('blur', hideTooltip);
    });
  }

  // --------------------------------------------------------------------------
  // 4. Simulador SCADA Interativo
  // --------------------------------------------------------------------------
  const simState = {
    p101: 150,    // Pressão (0-300 bar)
    t201: 45,     // Temperatura (0-120 °C)
    f301: 30,     // Vazão (0-100 kg/min)
    lt401: 65,    // Nível (0-100 %)
    k501: true,   // Compressor (on/off)
    v101: true,   // Válvula Entrada (aberta/fechada)
    v201: true    // Válvula Saída (aberta/fechada)
  };

  let activeAlarms = [];
  const MAX_LOG_ENTRIES = 30;

  function initSimulator() {
    const sliderP101 = document.getElementById('slider-p101');
    const sliderT201 = document.getElementById('slider-t201');
    const sliderF301 = document.getElementById('slider-f301');
    const sliderLT401 = document.getElementById('slider-lt401');

    const toggleK501 = document.getElementById('toggle-k501');
    const toggleV101 = document.getElementById('toggle-v101');
    const toggleV201 = document.getElementById('toggle-v201');

    const btnInjectFault = document.getElementById('btn-inject-fault');
    const btnClearLog = document.getElementById('btn-clear-log');

    if (!sliderP101) return; // Não está na página

    // Sliders Listeners
    sliderP101.addEventListener('input', (e) => {
      simState.p101 = parseInt(e.target.value, 10);
      updateSimulator();
    });

    sliderT201.addEventListener('input', (e) => {
      simState.t201 = parseInt(e.target.value, 10);
      updateSimulator();
    });

    sliderF301.addEventListener('input', (e) => {
      simState.f301 = parseInt(e.target.value, 10);
      updateSimulator();
    });

    sliderLT401.addEventListener('input', (e) => {
      simState.lt401 = parseInt(e.target.value, 10);
      updateSimulator();
    });

    // Toggles Listeners
    toggleK501.addEventListener('change', (e) => {
      simState.k501 = e.target.checked;
      updateSimulator();
    });

    toggleV101.addEventListener('change', (e) => {
      simState.v101 = e.target.checked;
      updateSimulator();
    });

    toggleV201.addEventListener('change', (e) => {
      simState.v201 = e.target.checked;
      updateSimulator();
    });

    // Injetar Falha Aleatória
    if (btnInjectFault) {
      btnInjectFault.addEventListener('click', injectRandomFault);
    }

    // Limpar Log
    if (btnClearLog) {
      btnClearLog.addEventListener('click', () => {
        const logBox = document.getElementById('alarm-log-box');
        if (logBox) {
          logBox.innerHTML = '';
          addLogEntry('ok', 'Log reiniciado pelo operador. Sistema em monitoramento contínuo.');
        }
      });
    }

    // Inicialização do Log
    addLogEntry('ok', 'Sistema SCADA Core inicializado. Todos os parâmetros nominais.');
    updateSimulator();
  }

  function updateSimulator() {
    // 1. Atualizar badges numéricas do painel de controle
    const valBadgeP101 = document.getElementById('val-badge-p101');
    const valBadgeT201 = document.getElementById('val-badge-t201');
    const valBadgeF301 = document.getElementById('val-badge-f301');
    const valBadgeLT401 = document.getElementById('val-badge-lt401');

    if (valBadgeP101) {
      valBadgeP101.textContent = `${simState.p101} bar`;
      valBadgeP101.className = `slider-val-badge ${simState.p101 > 250 ? 'val-danger' : simState.p101 > 200 ? 'val-warning' : 'val-normal'}`;
    }

    if (valBadgeT201) {
      valBadgeT201.textContent = `${simState.t201} °C`;
      valBadgeT201.className = `slider-val-badge ${simState.t201 > 90 ? 'val-danger' : simState.t201 > 70 ? 'val-warning' : 'val-normal'}`;
    }

    if (valBadgeF301) {
      valBadgeF301.textContent = `${simState.f301} kg/min`;
    }

    if (valBadgeLT401) {
      valBadgeLT401.textContent = `${simState.lt401} %`;
    }

    // 2. Atualizar Mimico SVG
    updateSvgMimic();

    // 3. Avaliar Lógica de Alarmes e Intertravamentos
    evaluateAlarmsAndInterlocks();
  }

  function updateSvgMimic() {
    // Nível do Tanque no SVG (#h2-level-fill)
    // O tanque vai de Y=100 (topo = 100%) a Y=360 (base = 0%) -> altura total 260px
    const levelFill = document.getElementById('h2-level-fill');
    const levelLine = document.getElementById('h2-level-line');
    const mimicLevelVal = document.getElementById('mimic-level-val');

    if (levelFill && levelLine) {
      const maxHeight = 260;
      const height = (simState.lt401 / 100) * maxHeight;
      const y = 360 - height;

      levelFill.setAttribute('y', y);
      levelFill.setAttribute('height', height);
      levelLine.setAttribute('y1', y);
      levelLine.setAttribute('y2', y);
    }

    if (mimicLevelVal) {
      mimicLevelVal.textContent = `${simState.lt401} %`;
    }

    // Compressor K-501 (Animação de rotação)
    const rotor = document.getElementById('rotor-k501');
    if (rotor) {
      if (simState.k501) {
        rotor.classList.add('rotating');
      } else {
        rotor.classList.remove('rotating');
      }
    }

    // Válvula V-101 e Linha de Entrada
    const statusV101 = document.getElementById('status-v101');
    const linhaEntrada = document.getElementById('linha-entrada');
    if (statusV101 && linhaEntrada) {
      if (simState.v101) {
        statusV101.textContent = 'ABERTA';
        statusV101.setAttribute('fill', '#2dd4bf');
        linhaEntrada.setAttribute('stroke', '#2dd4bf');
        linhaEntrada.classList.add('pipe-flow-active');
      } else {
        statusV101.textContent = 'FECHADA';
        statusV101.setAttribute('fill', '#64748b');
        linhaEntrada.setAttribute('stroke', '#475569');
        linhaEntrada.classList.remove('pipe-flow-active');
      }
    }

    // Válvula V-201 e Linha de Saída
    const statusV201 = document.getElementById('status-v201');
    const linhaSaida = document.getElementById('linha-saida');
    if (statusV201 && linhaSaida) {
      if (simState.v201) {
        statusV201.textContent = 'ABERTA';
        statusV201.setAttribute('fill', '#2dd4bf');
        linhaSaida.setAttribute('stroke', '#2dd4bf');
        linhaSaida.classList.add('pipe-flow-active');
      } else {
        statusV201.textContent = 'FECHADA';
        statusV201.setAttribute('fill', '#64748b');
        linhaSaida.setAttribute('stroke', '#475569');
        linhaSaida.classList.remove('pipe-flow-active');
      }
    }

    // Badges dos Sensores no SVG
    const mimicValP101 = document.getElementById('mimic-val-p101');
    const badgeBgP101 = document.getElementById('badge-bg-p101');
    if (mimicValP101 && badgeBgP101) {
      mimicValP101.textContent = `${simState.p101} bar`;
      const color = simState.p101 > 250 ? '#ef4444' : simState.p101 > 200 ? '#f59e0b' : '#2dd4bf';
      mimicValP101.setAttribute('fill', color);
      badgeBgP101.setAttribute('stroke', color);
    }

    const mimicValT201 = document.getElementById('mimic-val-t201');
    const badgeBgT201 = document.getElementById('badge-bg-t201');
    if (mimicValT201 && badgeBgT201) {
      mimicValT201.textContent = `${simState.t201} °C`;
      const color = simState.t201 > 90 ? '#ef4444' : simState.t201 > 70 ? '#f59e0b' : '#2dd4bf';
      mimicValT201.setAttribute('fill', color);
      badgeBgT201.setAttribute('stroke', color);
    }

    const mimicValF301 = document.getElementById('mimic-val-f301');
    if (mimicValF301) {
      mimicValF301.textContent = `${simState.f301} kg/min`;
    }
  }

  function evaluateAlarmsAndInterlocks() {
    const previousAlarms = [...activeAlarms];
    activeAlarms = [];

    let hasCritical = false;
    let hasWarning = false;

    // 1. Condição: Pressão > 250 bar -> CRÍTICO + ESD (Fecha válvulas)
    if (simState.p101 > 250) {
      hasCritical = true;
      activeAlarms.push({
        id: 'P101_HIGH_CRIT',
        level: 'crit',
        msg: `🔴 CRÍTICO — P-101: Sobrepressão perigosa (${simState.p101} bar > 250 bar). Intertravamento ESD acionado (fechamento preventivo das válvulas).`
      });

      // Atuação automática (ESD)
      if (simState.v101 || simState.v201) {
        simState.v101 = false;
        simState.v201 = false;
        const t1 = document.getElementById('toggle-v101');
        const t2 = document.getElementById('toggle-v201');
        if (t1) t1.checked = false;
        if (t2) t2.checked = false;
        updateSvgMimic();
      }
    } else if (simState.p101 > 200) {
      hasWarning = true;
      activeAlarms.push({
        id: 'P101_HIGH_WARN',
        level: 'warn',
        msg: `🟡 ATENÇÃO — P-101: Pressão de armazenamento elevada (${simState.p101} bar > 200 bar).`
      });
    }

    // 2. Condição: Temperatura > 90°C -> CRÍTICO + Desliga Compressor
    if (simState.t201 > 90) {
      hasCritical = true;
      activeAlarms.push({
        id: 'T201_HIGH_CRIT',
        level: 'crit',
        msg: `🔴 CRÍTICO — T-201: Superaquecimento do Compressor K-501 (${simState.t201}°C > 90°C). Desarme térmico automático acionado.`
      });

      // Atuação automática: Desligar compressor
      if (simState.k501) {
        simState.k501 = false;
        const tk = document.getElementById('toggle-k501');
        if (tk) tk.checked = false;
        updateSvgMimic();
      }
    } else if (simState.t201 > 70) {
      hasWarning = true;
      activeAlarms.push({
        id: 'T201_HIGH_WARN',
        level: 'warn',
        msg: `🟡 ATENÇÃO — T-201: Temperatura do compressor acima do setpoint (${simState.t201}°C > 70°C).`
      });
    }

    // 3. Condição: Nível < 10% -> ATENÇÃO
    if (simState.lt401 < 10) {
      hasWarning = true;
      activeAlarms.push({
        id: 'LT401_LOW_WARN',
        level: 'warn',
        msg: `🟡 ATENÇÃO — LT-401: Nível crítico de esvaziamento do banco (${simState.lt401}% < 10%).`
      });
    }

    // 4. Condição: V-201 aberta + Compressor desligado -> ATENÇÃO (Inconsistência)
    if (simState.v201 && !simState.k501 && simState.f301 > 0) {
      hasWarning = true;
      activeAlarms.push({
        id: 'INCONSISTENCY_WARN',
        level: 'warn',
        msg: `🟡 ATENÇÃO — V-201 aberta com Compressor K-501 desligado. Risco de perda de pressão na linha.`
      });
    }

    // Atualizar Banner de Status Geral
    const banner = document.getElementById('sim-status-banner');
    const counter = document.getElementById('sim-alarm-counter');
    const mimicStatusText = document.getElementById('mimic-status-text');

    if (banner && counter) {
      counter.textContent = `Alarmes Ativos: ${activeAlarms.length}`;

      if (hasCritical) {
        banner.className = 'sim-status-banner status-crit';
        banner.textContent = '🔴 FALHA CRÍTICA — INTERTRAVAMENTO ATIVO';
        if (mimicStatusText) {
          mimicStatusText.setAttribute('fill', '#f87171');
          mimicStatusText.textContent = 'TRIP DE SEGURANÇA / FALHA CRÍTICA';
        }
      } else if (hasWarning) {
        banner.className = 'sim-status-banner status-warn';
        banner.textContent = '🟡 ATENÇÃO — CONDIÇÃO ANÔMALA';
        if (mimicStatusText) {
          mimicStatusText.setAttribute('fill', '#fbbf24');
          mimicStatusText.textContent = 'ALERTA / ATENÇÃO NECESSÁRIA';
        }
      } else {
        banner.className = 'sim-status-banner status-ok';
        banner.textContent = '🟢 OPERANDO NORMALMENTE';
        if (mimicStatusText) {
          mimicStatusText.setAttribute('fill', '#4ade80');
          mimicStatusText.textContent = 'ONLINE / OPERAÇÃO NORMAL';
        }
      }
    }

    // Registrar novos alarmes no log
    activeAlarms.forEach(alarm => {
      const alreadyLogged = previousAlarms.some(prev => prev.id === alarm.id);
      if (!alreadyLogged) {
        addLogEntry(alarm.level, alarm.msg);
      }
    });

    // Se todos os alarmes sumiram e antes havia alarme
    if (activeAlarms.length === 0 && previousAlarms.length > 0) {
      addLogEntry('ok', '🟢 NORMALIZAÇÃO — Todos os parâmetros retornaram às faixas seguras de operação.');
    }
  }

  function addLogEntry(level, message) {
    const logBox = document.getElementById('alarm-log-box');
    if (!logBox) return;

    const timeStr = new Date().toLocaleTimeString('pt-BR');
    const entryEl = document.createElement('div');
    entryEl.className = `log-entry ${level}`;
    entryEl.innerHTML = `<span style="opacity: 0.65;">[${timeStr}]</span> ${message}`;

    logBox.insertBefore(entryEl, logBox.firstChild);

    // Limita tamanho do log
    while (logBox.children.length > MAX_LOG_ENTRIES) {
      logBox.removeChild(logBox.lastChild);
    }
  }

  function injectRandomFault() {
    const faults = [
      () => {
        // Sobrepressão
        simState.p101 = 285;
        const s = document.getElementById('slider-p101');
        if (s) s.value = 285;
      },
      () => {
        // Superaquecimento
        simState.t201 = 105;
        const s = document.getElementById('slider-t201');
        if (s) s.value = 105;
      },
      () => {
        // Nível Baixo
        simState.lt401 = 5;
        const s = document.getElementById('slider-lt401');
        if (s) s.value = 5;
      },
      () => {
        // Inconsistência de Saída
        simState.k501 = false;
        simState.v201 = true;
        simState.f301 = 65;
        const tK = document.getElementById('toggle-k501');
        const tV = document.getElementById('toggle-v201');
        const sF = document.getElementById('slider-f301');
        if (tK) tK.checked = false;
        if (tV) tV.checked = true;
        if (sF) sF.value = 65;
      }
    ];

    const randomFault = faults[Math.floor(Math.random() * faults.length)];
    randomFault();
    updateSimulator();
  }

  // --------------------------------------------------------------------------
  // 5. GitHub API - Colaboradores da Equipe
  // --------------------------------------------------------------------------
  const CONTRIBUTORS_API = 'https://api.github.com/repos/Automatica-Reabastecimento-H2-SCADA/Estacao-de-Reabastecimento-de-Hidrogenio---SCADA-Core/contributors';
  const REPO_URL = 'https://github.com/Automatica-Reabastecimento-H2-SCADA/Estacao-de-Reabastecimento-de-Hidrogenio---SCADA-Core';

  async function loadContributors() {
    const container = document.getElementById('team-contributors-grid');
    if (!container) return;

    // Renderiza skeletons
    container.innerHTML = `
      <div class="skeleton-contributor"><div class="skeleton-avatar"></div><div class="skeleton-line skeleton-name"></div><div class="skeleton-line skeleton-sub"></div></div>
      <div class="skeleton-contributor"><div class="skeleton-avatar"></div><div class="skeleton-line skeleton-name"></div><div class="skeleton-line skeleton-sub"></div></div>
      <div class="skeleton-contributor"><div class="skeleton-avatar"></div><div class="skeleton-line skeleton-name"></div><div class="skeleton-line skeleton-sub"></div></div>
      <div class="skeleton-contributor"><div class="skeleton-avatar"></div><div class="skeleton-line skeleton-name"></div><div class="skeleton-line skeleton-sub"></div></div>
    `;

    try {
      const res = await fetch(CONTRIBUTORS_API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Nenhum colaborador retornado.');
      }

      let html = '';
      data.forEach(user => {
        html += `
          <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="contributor-card" title="Ver perfil de ${user.login} no GitHub">
            <img src="${user.avatar_url}" alt="${user.login}" class="contributor-avatar" loading="lazy" />
            <span class="contributor-login">@${user.login}</span>
            <span class="contributor-commits"><strong>${user.contributions}</strong> ${user.contributions === 1 ? 'commit' : 'commits'}</span>
          </a>
        `;
      });

      container.innerHTML = html;

    } catch (err) {
      console.warn('Falha ao obter colaboradores do GitHub:', err);
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px dashed var(--border-color); border-radius: 12px; padding: 1.5rem; text-align: center;">
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.75rem;">
            Não foi possível carregar os colaboradores em tempo real. Consulte a equipe diretamente no repositório.
          </p>
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
            Ver Colaboradores no GitHub &rarr;
          </a>
        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // 6. Carregador do Diagrama Estático (Modo Leitura)
  // --------------------------------------------------------------------------
  async function loadStaticDiagram() {
    const container = document.getElementById('diagrama-static-viewport');
    if (!container) return;

    if (!container.querySelector('svg')) {
      try {
        const res = await fetch('assets/diagrama.svg');
        if (res.ok) {
          const svgText = await res.text();
          container.innerHTML = svgText;
          attachTooltips();
        }
      } catch (e) {
        console.warn('Diagrama estático carregado com fallback.');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 7. Inicialização no DOMContentLoaded
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    attachTooltips();
    initSimulator();
    loadStaticDiagram();
    loadContributors();
  });

})();
