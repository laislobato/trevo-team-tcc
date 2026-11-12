# 🍀 Trevo Team

Site da **Trevo Team**, uma publisher fictícia que divulga e financia jogos indie.
Projeto de TCC do curso **Técnico em Informática para Internet** da
**Etec "Comendador João Rays"** (Barra Bonita – SP).

> Todos os jogos, estúdios, posts e comentários do site são **ficticios**.
> O site foi feito como um projeto de tcc para demonstação

O projeto tem duas partes:

| Parte | Pasta | O que faz |
| --- | --- | --- |
| **Front** (site) | raiz do projeto (`src/`) | As páginas que o público vê + o painel da equipe |
| **Back** (API) | `server/` | Guarda os posts do blog, as desenvolvedoras e as imagens, e cuida do login |

---


## 🧰 Tecnologias

- **React 19**: monta as páginas a partir de componentes
- **Vite 8**: roda o projeto no computador e gera a versão final
- **React Router 7**: troca de página sem recarregar o site
- **CSS puro**: um arquivo de estilo para cada componente

---

## 🚀 Como iniciar o projeto

**Requisitos:** Node.js 22 ou mais novo e Git.

```bash
git clone <endereço-do-repositório>
cd trevo-team
npm install       # instala as dependências (só na primeira vez)
npm run dev       # abre o site em http://localhost:5173
```

### Comandos

| Comando | Para quê |
| --- | --- |
| `npm run dev` | Liga o site em modo desenvolvimento (atualiza sozinho ao salvar) |
| `npm run build` | Gera a versão final do site na pasta `dist/` |
| `npm run preview` | Abre a versão do `dist/` para conferir |
| `npm run lint` | Procura erros no código |

---

## 🗺️ Páginas do site

| Endereço | Página | Arquivo |
| --- | --- | --- |
| `/` | Início | `src/pages/Home.jsx` |
| `/jogo` | Página inicial dos jogos (banners, vitrine e comentários) | `src/pages/Games.jsx` |
| `/jogo/:slug` | Página de um jogo (modelo usado por todos) | `src/pages/GamePage.jsx` |
| `/sobre` | Sobre a Trevo Team | `src/pages/About.jsx` |
| `/blog` | Blog (abas e FAQ) | `src/pages/Blog/Blog.jsx` |
| `/blog/:slug` | Um post do blog | `src/pages/Blog/BlogPost.jsx` |
| `/contato` | Contact Us e suporte | `src/pages/Contact.jsx` |

As rotas ficam em `src/App.jsx`. Qualquer endereço que não existe volta para o Início.

---

## ⚙️ Como o projeto funciona

### Estrutura de pastas

```
src/
├── main.jsx            liga o React no index.html
├── App.jsx             rotas: qual página aparece em cada endereço
├── pages/              uma página por arquivo (monta a página juntando componentes)
├── components/         pedaços das páginas, separados por área
│   ├── shared/         Header, Footer e Newsletter (usados em várias páginas)
│   ├── Home/           Hero (carrossel de banners), Projects, Testimonials
│   ├── GamesHome/      GameShowcase (vitrine) e GameReviews (comentários)
│   ├── Games/          blocos da página de um jogo
│   ├── Blog/  Contact/  About/
│   └── <Área>/css/     o CSS de cada componente fica na pasta css/ da área
├── data/               conteúdo do site: jogos, FAQ, tipos de post
├── services/
│   └── games.js        onde as páginas de jogos buscam os dados
├── styles/
│   └── globals.css     cores, espaçamentos e estilos gerais
└── assets/             imagens (logo, banners...)
```

### Como uma página é montada

A página (`pages/`) junta vários componentes (`components/`) e passa para eles o
conteúdo por *props*. Cada componente tem o seu próprio CSS.

Exemplo: `pages/Games.jsx` usa `Header`, `Hero`, `GameShowcase`, `GameReviews` e `Footer`.

### Cores

Ficam em `src/styles/globals.css`, como variáveis do CSS:

| Variável | Cor |
| --- | --- |
| `--primary-cyan` | `#D0FFFB` (ciano) |
| `--primary-orange` | `#F8906A` (laranja) |
| `--primary-green` | `#3ECA22` (verde) |
| `--light-gray` | `#D9D9D9` (cinza dos blocos) |
| cores da marca | `#8CC74F` (verde-trevo) e `#003223` (verde-escuro do rodapé) |

Os espaçamentos (`--spacing-*`), os cantos (`--radius-*`) e as animações
(`--transition-*`) também ficam ali.

### Jogos

Os jogos ficam em `src/data/games.js`. A página inicial dos jogos (`/jogo`) mostra
todos na vitrine, e cada jogo tem a sua página em `/jogo/<slug>`, montada pelo mesmo
modelo (`GamePage.jsx`).

**Para adicionar um jogo:** copie um bloco da lista `games` em `src/data/games.js`
e mude os campos (o significado de cada um está explicado no começo do arquivo).
O endereço vem do `slug`: `slug: 'meu-jogo'` vira `/jogo/meu-jogo`.
A vitrine e a página do jogo se ajustam sozinhas.

### Onde mudar cada conteúdo

| Conteúdo | Arquivo |
| --- | --- |
| Jogos, banners da página de jogos e comentários | `src/data/games.js` |
| Perguntas do FAQ | `src/data/faq.js` |
| Banners da Home | `src/components/Home/Hero.jsx` |
| Menu e redes sociais | `src/components/shared/Header.jsx` |
| Links do rodapé | `src/components/shared/Footer.jsx` |

---
