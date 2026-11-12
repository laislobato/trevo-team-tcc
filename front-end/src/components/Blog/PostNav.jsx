/**
 * COMPONENTE: PostNav
 * ===================
 * Navegação para o post anterior e o próximo, no fim da página do post:
 *
 *   [ ← Anterior  (miniatura) título ]   [ Próxima →  título (miniatura) ]
 *
 * Props:
 * - previous: post anterior (ou null, se não houver)
 * - next:     próximo post (ou null, se não houver)
 */

import { Link } from 'react-router-dom'
import './css/PostNav.css'

function NavCard({ post, direction }) {
  // Sem post nesse lado: deixa o espaço vazio para manter o layout
  if (!post) return <div className="post-nav-empty" aria-hidden="true"></div>

  const isNext = direction === 'next'
  return (
    <Link to={`/blog/${post.slug}`} className={`post-nav-card ${isNext ? 'post-nav-card--next' : ''}`}>
      <span className="post-nav-label">{isNext ? 'Próxima →' : '← Anterior'}</span>
      <span className="post-nav-body">
        <span className="post-nav-thumb">
          {post.cover && <img src={post.cover} alt="" />}
        </span>
        <span className="post-nav-title">{post.title}</span>
      </span>
    </Link>
  )
}

export default function PostNav({ previous, next }) {
  return (
    <nav className="post-nav" aria-label="Outros posts">
      <NavCard post={previous} direction="previous" />
      <NavCard post={next} direction="next" />
    </nav>
  )
}
