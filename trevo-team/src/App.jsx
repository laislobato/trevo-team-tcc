/**
 * ARQUIVO: App.jsx
 * ================
 * Define as rotas (qual página aparece para cada endereço).
 *
 * Site:
 * - /            -> Home (Início)
 * - /jogo        -> Games (página de um jogo)
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
 * - /painel/desenvolvedoras         -> lista de desenvolvedoras
 * - /painel/desenvolvedoras/nova    -> criar desenvolvedora
 * - /painel/desenvolvedoras/:id     -> editar desenvolvedora
 * - /painel/conta                   -> trocar senha
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
import Blog from './pages/Blog/Blog'
import BlogPost from './pages/Blog/BlogPost'

// Painel
import Login from './pages/Admin/Login'
import AdminPosts from './pages/Admin/AdminPosts'
import PostEditor from './pages/Admin/PostEditor'
import AdminDevelopers from './pages/Admin/AdminDevelopers'
import DeveloperEditor from './pages/Admin/DeveloperEditor'
import AdminAccount from './pages/Admin/AdminAccount'

// Atalho: página do painel protegida pelo login
const admin = (page) => <ProtectedRoute>{page}</ProtectedRoute>

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ---------- Site ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/jogo" element={<Games />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contato" element={<Contact />} />

          {/* ---------- Painel ---------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/painel" element={admin(<AdminPosts />)} />
          <Route path="/painel/posts/novo" element={admin(<PostEditor />)} />
          <Route path="/painel/posts/:id" element={admin(<PostEditor />)} />
          <Route path="/painel/desenvolvedoras" element={admin(<AdminDevelopers />)} />
          <Route path="/painel/desenvolvedoras/nova" element={admin(<DeveloperEditor />)} />
          <Route path="/painel/desenvolvedoras/:id" element={admin(<DeveloperEditor />)} />
          <Route path="/painel/conta" element={admin(<AdminAccount />)} />

          {/* Qualquer rota desconhecida volta para a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
