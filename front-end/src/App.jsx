/**
 * ARQUIVO: App.jsx
 * ================
 * Define as rotas (qual página aparece para cada endereço).
 *
 * Site:
 * - /            -> Home (Início)
 * - /jogo        -> Games (página inicial dos jogos, com a vitrine)
 * - /jogo/:slug  -> GamePage (página de um jogo, modelo para todos)
 * - /sobre       -> About
 * - /blog        -> Blog (lista de posts, com abas e FAQ)
 * - /blog/:slug  -> BlogPost (página de um post)
 * - /contato     -> Contact (Contact Us e suporte)
 *
 * Painel da equipe (precisa de login):
 * - /login                          -> entrar
 * - /painel                         -> lista de posts
 * - /painel/posts/novo              -> criar post
 * - /painel/posts/:id               -> editar post
 * - /painel/jogos                   -> lista de jogos
 * - /painel/jogos/novo              -> criar jogo
 * - /painel/jogos/:id               -> editar jogo
 * - /painel/desenvolvedoras         -> lista de desenvolvedoras (só admin)
 * - /painel/desenvolvedoras/nova    -> criar desenvolvedora (só admin)
 * - /painel/desenvolvedoras/:id     -> editar desenvolvedora + logins do estúdio
 *                                      (estúdio: "Meu estúdio", só a dele)
 * - /painel/banners                 -> banners da Home e da página /jogo (só admin)
 * - /painel/conta                   -> dados do login e trocar senha
 *
 * Estúdio só vê os posts e jogos dele: quem garante isso é a API.
 *
 * Qualquer outro endereço -> volta para a Home
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/Admin/ProtectedRoute'
import './styles/globals.css'

// Site
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Games from './pages/Games'
import GamePage from './pages/GamePage'
import Blog from './pages/Blog/Blog'
import BlogPost from './pages/Blog/BlogPost'

// Painel
import Login from './pages/Admin/Login'
import AdminPosts from './pages/Admin/AdminPosts'
import PostEditor from './pages/Admin/PostEditor'
import AdminGames from './pages/Admin/AdminGames'
import GameEditor from './pages/Admin/GameEditor'
import AdminBanners from './pages/Admin/AdminBanners'
import AdminDevelopers from './pages/Admin/AdminDevelopers'
import DeveloperEditor from './pages/Admin/DeveloperEditor'
import AdminAccount from './pages/Admin/AdminAccount'

// Atalhos: página do painel protegida pelo login
// - admin(...):     qualquer login (admin da Trevo ou estúdio)
// - adminOnly(...): só a equipe da Trevo (estúdio volta para /painel)
const admin = (page) => <ProtectedRoute>{page}</ProtectedRoute>
const adminOnly = (page) => <ProtectedRoute adminOnly>{page}</ProtectedRoute>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---------- Site ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/jogo" element={<Games />} />
          <Route path="/jogo/:slug" element={<GamePage />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contato" element={<Contact />} />

          {/* ---------- Painel ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/painel" element={admin(<AdminPosts />)} />
          <Route path="/painel/posts/novo" element={admin(<PostEditor />)} />
          <Route path="/painel/posts/:id" element={admin(<PostEditor />)} />
          <Route path="/painel/jogos" element={admin(<AdminGames />)} />
          <Route path="/painel/jogos/novo" element={admin(<GameEditor />)} />
          <Route path="/painel/jogos/:id" element={admin(<GameEditor />)} />
          <Route path="/painel/desenvolvedoras" element={adminOnly(<AdminDevelopers />)} />
          <Route path="/painel/desenvolvedoras/nova" element={adminOnly(<DeveloperEditor />)} />
          <Route path="/painel/banners" element={adminOnly(<AdminBanners />)} />
          <Route path="/painel/desenvolvedoras/:id" element={admin(<DeveloperEditor />)} />
          <Route path="/painel/conta" element={admin(<AdminAccount />)} />

          {/* Qualquer rota desconhecida volta para a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}