/**
 * COMPONENTE: PostAuthor
 * ======================
 * Linha com a foto do autor, o nome e a data:
 *
 *   (foto) Vitor Martins • 28/08/2026
 *
 * Props:
 * - author: { name, photo }  (photo vazio = bolinha cinza)
 * - date:   data do post (texto)
 * - size:   'small' (lista do blog) ou 'large' (página do post)
 */

import './css/Blog.css'

export default function PostAuthor({ author = {}, date = '', size = 'small' }) {
  return (
    <div className={`post-author post-author--${size}`}>
      <span className="post-author-photo">
        {author.photo && <img src={author.photo} alt="" />}
      </span>
      <span className="post-author-name">{author.name}</span>
      <span className="post-author-dot" aria-hidden="true">•</span>
      <time className="post-author-date">{date}</time>
    </div>
  )
}
