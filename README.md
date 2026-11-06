# 🚀 Guia de Setup - Trevo Team TCC

## 📋 Pré-requisitos
- **Node.js** 16+ instalado ([baixar](https://nodejs.org/))
- **Git** (opcional, mas recomendado)

## 1️⃣ Criar o Projeto

```bash
# Cria um novo projeto Vite com React
npm create vite@latest seu-tcc -- --template react

# Entra na pasta
cd seu-tcc

# Instala as dependências
npm install
```

## 2️⃣ Estrutura de Pastas

Crie essa estrutura dentro de `src/`:

```
seu-tcc/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Projects.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

## 3️⃣ Instalação de Dependências Adicionais

### Opção A: Sem extras (recomendado para começar)
```bash
npm install
```

### Opção B: Com Tailwind (se quiser)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Opção C: Com React Router (para múltiplas páginas)
```bash
npm install react-router-dom
```

## 4️⃣ Copiar os Arquivos

1. Crie `src/pages/Home.jsx` e copie o conteúdo que passei
2. Crie `src/pages/Home.css` e copie o CSS refatorado

## 5️⃣ Atualizar App.jsx

```jsx
import Home from './pages/Home'
import './styles/globals.css'

function App() {
  return (
    <div className="app">
      <Home />
    </div>
  )
}

export default App
```

## 6️⃣ Reset Global CSS

Crie `src/styles/globals.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## 7️⃣ Executar o Projeto

```bash
# Inicia o servidor de desenvolvimento
npm run dev
```

Abrirá em `http://localhost:5173`

## 📦 Estrutura de Componentes (Próximo Passo)

Para deixar bem modular, quebra `Home.jsx` em componentes:

```jsx
// src/pages/Home.jsx
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Projects from '../components/Projects'
import './Home.css'

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <Hero />
      <Services />
      <Projects />
    </div>
  )
}
```

## 🔧 Comandos Úteis

```bash
npm run dev      # Inicia servidor (development)
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Lint do código (se instalado)
```

## 📝 Alterações Feitas no CSS

✅ Removido `position: absolute` (quebrava responsividade)
✅ Adicionado `flexbox` e `grid` (dinâmico)
✅ Criadas variáveis CSS (`:root`)
✅ Media queries mobile-first
✅ Hover effects nos cards
✅ Shadows e transições

## 🎨 Personalizações Rápidas

### Mudar cores
No `Home.css`, edite as cores em `:root`:
```css
:root {
  --primary-cyan: #D0FFFB;
  --primary-orange: #F8906A;
  /* etc */
}
```

### Adicionar fontes customizadas
No `index.html`, adicione:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### Ajustar spacing
As medidas estão em variáveis, fácil de mudar:
```css
--spacing-lg: 4rem;  /* Mude aqui */
```

## ⚡ Próximos Passos Recomendados

1. **Componentizar** (quebrar em Header, Hero, Services, etc)
2. **Adicionar rotas** (React Router para outras páginas)
3. **Criar backend** (.NET conforme disse, ou Node.js)
4. **Adicionar animações** (Framer Motion é leve)
5. **Deploy** (Vercel, Netlify ou GitHub Pages)

## 🆘 Troubleshooting

### Porta 5173 já está em uso
```bash
npm run dev -- --port 3000
```

### Importações não funcionam
Certifique-se de que está usando `import` (não `require`)

### Erro de módulo
Delete `node_modules` e `package-lock.json`, depois:
```bash
npm install
```

---

**Dúvidas?** Eu tô por aqui! Boa sorte no TCC! 🚀