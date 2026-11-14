/**
 * PÁGINA: BlogPost
 * ================
 * Página de um post (no Figma: "Blog Access"), na rota /blog/:slug.
 * O post vem do backend (GET /api/posts/:slug), junto com o anterior e o próximo.
 *
 * Estrutura (de cima para baixo):
 * - Header
 * - BlogBanner     -> faixa ciano (mostra a capa do post, se houver)
 * - Tipo e título  -> "World Premiere" + título do post
 * - PostGallery    -> uma imagem grande e duas menores
 * - PostAuthor     -> foto, nome e data
 * - Texto do post
 * - PostDeveloper  -> "Developed By": estúdio e integrantes
 * - Divisor curto
 * - PostNav        -> post anterior e próximo
 * - Footer
 */

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../../components/shared/Header'
import Footer from '../../components/shared/Footer'
import BlogBanner from '../../components/Blog/BlogBanner'
import PostGallery from '../../components/Blog/PostGallery'
import PostAuthor from '../../components/Blog/PostAuthor'
import PostDeveloper from '../../components/Blog/PostDeveloper'
import PostNav from '../../components/Blog/PostNav'
import { api } from '../../services/api'
import { POST_TYPES } from '../../data/posts'
import '../../styles/globals.css'
import '../../components/Blog/css/Blog.css'

export default function BlogPost() {
  const { slug } = useParams() // lê o slug do endereço (/blog/<slug>)
  const [data, setData] = useState(null) // { post, previous, next }
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'notfound' | 'error'
  const [error, setError] = useState('')

  // Busca o post sempre que o slug muda (ex.: clicar em Anterior/Próxima)
  useEffect(() => {
    let active = true
    setStatus('loading')
    window.scrollTo(0, 0)
    api
      .getPost(slug)
      .then((result) => {
        if (active) {
          setData(result)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setStatus(err.status === 404 ? 'notfound' : 'error')
      })
    return () => {
      active = false
    }
  }, [slug])

  // Carregando, não encontrado ou erro: mesma moldura, mensagem diferente
  if (status !== 'ready') {
    const messages = {
      loading: { title: 'Carregando...', text: '' },
      notfound: { title: 'Post não encontrado', text: 'O endereço pode estar errado ou o post foi removido.' },
      error: { title: 'Não foi possível abrir o post', text: error },
    }
    const { title, text } = messages[status]
    return (
      <div className="blog-page">
        <Header />
        <section className="post-not-found" aria-live="polite">
          <h2>{title}</h2>
          {text && <p>{text}</p>}
          {status !== 'loading' && <Link to="/blog">Voltar para o blog</Link>}
        </section>
        <Footer />
      </div>
    )
  }

  const { post, previous, next } = data

  return (
    <div className="blog-page">
      {/* ========== CABEÇALHO POR CIMA DO BANNER (capa do post) ========== */}
      <div className="page-top">
        <Header flat />
        <BlogBanner image={post.cover} alt="" />
      </div>

      <article className="post-content">
        {/* ========== TIPO E TÍTULO ========== */}
        <header className="post-header">
          <p className="post-type">{POST_TYPES[post.type]}</p>
          <h2 className="post-title">{post.title}</h2>
        </header>

        {/* ========== GALERIA ========== */}
        <PostGallery images={post.gallery} title={post.title} />

        {/* ========== AUTOR E DATA ========== */}
        <div className="post-meta">
          <PostAuthor author={post.author} date={post.date} size="large" />
        </div>

        {/* ========== TEXTO ========== */}
        <div className="post-body">
          {post.subtitle && <p className="post-subtitle">{post.subtitle}</p>}
          {post.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* ========== DEVELOPED BY ========== */}
        <PostDeveloper developer={post.developer} />

        {/* ========== DIVISOR E NAVEGAÇÃO ========== */}
        <div className="post-divider"></div>
        <PostNav previous={previous} next={next} />
      </article>

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}