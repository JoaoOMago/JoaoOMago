# Steam Profile — Portfólio Pessoal Estático (GitHub Pages)

Um site de portfólio estático moderno, modular e de alta performance, inspirado na estética visual de **perfis da Steam**. Desenvolvido exclusivamente com **HTML5, CSS3 e JavaScript Vanilla (ES6+)**, sem frameworks pesados, sem ferramentas de build obrigatórias e projetado para hospedagem direta no **GitHub Pages** a partir da pasta `/docs`.

---

## 🎮 Principais Características

- **Estética Steam Profile:** Fundo com iluminação atmosférica visível nas laterais e uma coluna central semitransparente com efeito glassmorphism e sombras profundas.
- **Transparência Configurável:** Controle direto da opacidade do painel central através de `panelOpacity` em `assets/js/config.js` ou via variável CSS `--panel-opacity`.
- **Feed Modular de Projetos:** Cada projeto fica isolado em sua própria pasta (`assets/projetos/<slug>/`) com metadados, capas e arquivos de conteúdo separados.
- **Carregamento Sob Demanda (Zero Mídia Pesada na Home):** A página inicial carrega apenas thumbnails e resumos. Vídeos (`<video>`) e capturas de tela detalhadas só são injetados no DOM quando o usuário abre o projeto, sendo imediatamente descartados da memória ao voltar para a home.
- **Internacionalização (i18n) com Fallback Inteligente:** Detecção automática do idioma do navegador, persistência de escolha em `localStorage`, seletor manual (PT / EN) e algoritmo de fallback em 5 etapas para conteúdos.
- **Módulos Reordenáveis e Desligáveis:** Seções (Hero, Sobre, Habilidades, Projetos, Contato) podem ser ativadas, desativadas ou reordenadas apenas editando o `config.js`, sem mexer no HTML.
- **Script Auxiliar de Reindexação:** Utilitário nativo para escanear pastas e gerar `projects-index.json` automaticamente.

---

## 📁 Estrutura de Pastas

```text
.
├── docs/                        # Pasta raiz servida pelo GitHub Pages
│   ├── index.html               # Ponto de entrada da aplicação
│   ├── assets/
│   │   ├── css/
│   │   │   ├── base.css         # Reset, tipografia e scrollbar Steam
│   │   │   ├── layout.css       # Fundo atmosférico e grid da coluna central
│   │   │   ├── components.css   # Avatar Steam, cards de projetos, modal e badges
│   │   │   └── themes.css       # Paleta de cores e variáveis CSS
│   │   ├── js/
│   │   │   ├── config.js        # Configurações do perfil, redes, opacidade e módulos
│   │   │   ├── i18n.js          # Dicionário, detecção de idioma e fallback
│   │   │   ├── router.js        # Roteador hash (#/ e #/projeto/:slug)
│   │   │   ├── projects-loader.js # Leitura de índice, ordenação e feed
│   │   │   ├── lazy-media.js    # Injeção e destruição de vídeos sob demanda
│   │   │   └── app.js           # Orquestração da aplicação
│   │   ├── icons/               # Ícones SVG (GitHub, LinkedIn, Steam, etc.)
│   │   └── projetos/            # Diretório modular de projetos
│   │       ├── cyber-strike/    # Exemplo 1: projeto com vídeo sob demanda
│   │       │   ├── meta.json
│   │       │   ├── pt.html
│   │       │   ├── en.html
│   │       │   └── media/
│   │       ├── data-sphere/     # Exemplo 2: projeto com galeria de imagens
│   │       │   ├── meta.json
│   │       │   ├── pt.html
│   │       │   ├── en.html
│   │       │   └── media/
│   │       └── retro-synth/     # Exemplo 3: projeto de áudio interativo
│   └── data/
│       └── projects-index.json  # Índice consolidado gerado automaticamente
├── scripts/
│   ├── build-index.js           # Gerador do índice em Node.js (sem dependências)
│   └── build-index.py           # Gerador do índice em Python (alternativa)
└── README.md
```

---

## 🛠️ Guia de Manutenção e Customização

### 1. Como Adicionar um Novo Projeto

1. Crie uma nova pasta em `docs/assets/projetos/<slug-do-projeto>/`.
2. Adicione um arquivo `meta.json` com o formato:
   ```json
   {
     "id": "meu-novo-projeto",
     "order": 4,
     "status": "visible",
     "date": "2026-07-01",
     "title": {
       "pt": "Meu Novo Projeto",
       "en": "My Brand New Project"
     },
     "summary": {
       "pt": "Resumo curto em uma ou duas linhas para o feed inicial.",
       "en": "Short one or two sentence overview for the home feed card."
     },
     "tags": ["JavaScript", "WebGL", "CSS"],
     "cover": "assets/projetos/meu-novo-projeto/media/capa.svg",
     "video": "assets/projetos/meu-novo-projeto/media/demo.mp4",
     "demoUrl": "https://meu-projeto.com",
     "repoUrl": "https://github.com/usuario/meu-projeto"
   }
   ```
3. Crie os arquivos de conteúdo detalhado nos idiomas que desejar:
   - `pt.html` (conteúdo em português)
   - `en.html` (conteúdo em inglês)
4. Coloque a capa e eventuais mídias dentro da pasta `media/`.
5. Execute o script de reindexação (veja abaixo).

### 2. Como Rodar o Script de Reindexação

Sempre que adicionar, alterar metadados ou renomear projetos, rode o script localmente antes de enviar para o GitHub:

**Com Node.js:**
```bash
node scripts/build-index.js
```

**Ou com Python:**
```bash
python scripts/build-index.py
```

O script varrerá `docs/assets/projetos/`, detectará os idiomas disponíveis e atualizará automaticamente o arquivo `docs/data/projects-index.json`.

### 3. Como Ocultar ou Remover um Projeto

- **Para Ocultar temporariamente:** Abra o `meta.json` do projeto e altere `"status": "visible"` para `"status": "hidden"`. Ele continuará salvo na pasta, mas não aparecerá no feed do site.
- **Para Remover definitivamente:** Exclua a pasta do projeto e rode novamente o script de reindexação.

### 4. Como Customizar Redes Sociais

Edite o arquivo `docs/assets/js/config.js` no campo `socials`:
```javascript
socials: [
  {
    name: "GitHub",
    icon: "assets/icons/github.svg",
    url: "https://github.com/seu-usuario",
    visible: true // Mude para false para esconder
  },
  {
    name: "LinkedIn",
    icon: "assets/icons/linkedin.svg",
    url: "https://linkedin.com/in/seu-usuario",
    visible: true
  }
]
```

### 5. Como Ajustar a Transparência do Painel Central

No `docs/assets/js/config.js`, altere o valor de `panelOpacity`:
```javascript
panelOpacity: 0.88, // Aceita de 0.0 (totalmente transparente) a 1.0 (sólido)
```
O JavaScript injeta automaticamente o valor na variável CSS `--panel-opacity`, alterando a transparência em tempo real sem você precisar editar nenhum arquivo CSS.

### 6. Como Ativar, Desativar ou Reordenar Seções (Módulos)

No `docs/assets/js/config.js`, você pode alterar a ordem de exibição (`order`) ou desligar (`enabled: false`) qualquer seção:
```javascript
modules: [
  { id: "hero", enabled: true, order: 1 },     // Cabeçalho Steam
  { id: "about", enabled: true, order: 2 },    // Caixa de destaque / bio
  { id: "skills", enabled: true, order: 3 },   // Insígnias de habilidades
  { id: "projects", enabled: true, order: 4 }, // Vitrine de projetos
  { id: "contact", enabled: true, order: 5 }   // Mural de contato
]
```

### 7. Como Funciona a Internacionalização (i18n)

- **Detecção Automática:** Ao carregar a página, se `navigator.language` for português (`pt`), o site inicia em PT. Caso contrário, inicia em inglês (`en`).
- **Seletor Manual:** O usuário pode alternar a qualquer momento clicando em `🇧🇷 PT` ou `🇺🇸 EN` na barra superior. A escolha fica salva no `localStorage`.
- **Fallback para Conteúdo de Projetos:**
  1. Tenta carregar o idioma ativo atual (ex: `pt.html`);
  2. Se não existir, tenta carregar a versão em inglês (`en.html`);
  3. Se não existir, tenta a versão em português (`pt.html`);
  4. Se não existir, tenta qualquer outro idioma disponível na pasta;
  5. Se nenhum existir, exibe uma mensagem amigável ("Conteúdo não disponível neste idioma").

---

## 🚀 Como Publicar no GitHub Pages

1. Crie um repositório no GitHub (ou use o seu repositório existente).
2. Faça commit e push dos arquivos deste projeto.
3. No GitHub, acesse a aba **Settings** (Configurações) do seu repositório.
4. No menu lateral esquerdo, clique em **Pages**.
5. Na seção **Build and deployment**:
   - **Source:** Selecione `Deploy from a branch`.
   - **Branch:** Selecione a branch principal (`main` ou `master`) e a pasta **/docs**.
   - Clique em **Save**.
6. Aguarde alguns segundos e seu portfólio estará online no endereço `https://<seu-usuario>.github.io/<nome-do-repositorio>/`!
