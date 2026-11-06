/**
 * PÁGINA: Blog
 * ============
 * Lista de posts do blog, na rota /blog.
 * Os posts vêm do backend (GET /api/posts); as perguntas do FAQ, de src/data/faq.js.
 *
 * Estrutura (de cima para baixo):
 * - Header (igual ao das outras páginas)
 * - BlogBanner  -> faixa ciano reservada para a arte
 * - BlogHeading -> "Novidades das Equipes" com o enfeite de folhas
 * - BlogTabs    -> Todos, Anúncios, Patch Notes, Avisos e FAQ
 * - BlogCard    -> um card por post, alternando o lado da imagem
 *   (ou BlogFaq, quando a aba FAQ está selecionada)
 * - Newsletter e Footer
 */

import { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Newsletter from '../../components/shared/Newsletter'
import Footer from '../../components/shared/Footer'
import BlogBanner from '../../components/Blog/BlogBanner'
import BlogHeading from '../../components/Blog/BlogHeading'
import BlogTabs from '../../components/Blog/BlogTabs'
import BlogCard from '../../components/Blog/BlogCard'
import BlogFaq from '../../components/Blog/BlogFaq'
import { api } from '../../services/api'
import { faq } from '../../data/faq'
import '../../styles/globals.css'
import '../../components/Blog/css/Blog.css'

// Abas do blog. "id" igual ao "type" dos posts (ou 'todos' / 'faq')
const tabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'anuncio', label: 'Anúncios' },
  { id: 'patch', label: 'Patch Notes' },
  { id: 'aviso', label: 'Avisos' },
  { id: 'faq', label: 'FAQ' },
]

export default function Blog() {
  const [activeTab, setActiveTab] = useState('todos')
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('')

  // Busca os posts uma vez, quando a página abre
  useEffect(() => {
    let active = true // evita atualizar a tela se a pessoa já saiu da página
    api
      .getPosts()
      .then((data) => {
        if (active) {
          setPosts(data)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
          setStatus('error')
        }
      })
    return () => {
      active = false
    }
  }, [])

  // Posts da aba atual (o filtro é feito aqui, sem buscar de novo)
  const visiblePosts =
    activeTab === 'todos' ? posts : posts.filter((post) => post.type === activeTab)

  // O que aparece no lugar da lista
  function renderList() {
    if (activeTab === 'faq') return <BlogFaq items={faq} />
    if (status === 'loading') return <p className="blog-empty">Carregando posts...</p>
    if (status === 'error') return <p className="blog-empty blog-error">{error}</p>
    if (visiblePosts.length === 0) return <p className="blog-empty">Ainda não há posts nesta categoria.</p>
    return visiblePosts.map((post, index) => (
      <BlogCard key={post.slug} post={post} reverse={index % 2 === 1} />
    ))
  }

  return (
    <div className="blog-page">
      {/* ========== CABEÇALHO ========== */}
      <Header />

      {/* ========== BANNER ========== */}
      <BlogBanner />

      {/* ========== TÍTULO E ABAS ========== */}
      <BlogHeading title="Novidades das Equipes" />
      <BlogTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} />

      {/* ========== POSTS OU FAQ ========== */}
      <section className="blog-list" aria-live="polite" aria-busy={status === 'loading'}>
        {renderList()}
      </section>

      {/* ========== NEWSLETTER E RODAPÉ ========== */}
      <Newsletter />
      <Footer />
    </div>
  )
}
