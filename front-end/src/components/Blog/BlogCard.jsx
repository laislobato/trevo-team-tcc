/**
 * COMPONENTE: BlogCard
 * ====================
 * Um post na lista do blog: imagem com moldura de folhas de um lado
 * e o texto do outro. Os cards alternam o lado e a cor das folhas:
 *
 *   card par:   [imagem + folhas verdes à esquerda]  [texto]
 *   card ímpar: [texto]  [imagem + folhas laranja à direita]
 *
 * Props:
 * - post:    um item de data/posts.js
 * - reverse: true = imagem à direita (folhas laranja)
 */

import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'
import { POST_TYPES } from '../../data/posts'
import './css/BlogCard.css'

export default function BlogCard({ post, reverse = false }) {
  const link = `/blog/${post.slug}`

  return (
    <article className={`blog-card ${reverse ? 'blog-card--reverse' : ''}`}>
      {/* 🖼️ IMAGEM COM MOLDURA DE FOLHAS */}
      <Link to={link} className="blog-card-media" tabIndex={-1} aria-hidden="true">
        <span className="blog-card-leaves"></span>
        <span className="blog-card-image">
          {post.cover && <img src={post.cover} alt="" />}
          <span className="blog-card-tag">{POST_TYPES[post.type]}</span>
        </span>
      </Link>

      {/* 📝 TEXTO */}
      <div className="blog-card-text">
        <PostAuthor author={post.author} date={post.date} />
        <h3 className="blog-card-title">
          <Link to={link}>{post.title}</Link>
        </h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <Link to={link} className="blog-card-more">
          SAIBA MAIS <span className="visually-hidden">sobre: {post.title}</span>
        </Link>
      </div>
    </article>
  )
}
