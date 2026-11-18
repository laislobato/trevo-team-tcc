/**
 * PÁGINA: AdminOverview
 * =====================
 * Início do painel (/painel): resumo do site para quem acabou de entrar.
 *
 *   [Posts publicados] [Rascunhos] [Jogos no site] [Banners | Integrantes]
 *   Continue de onde parou            Precisa de atenção
 *   (últimos itens mexidos)           Atalhos
 *
 * - Admin: vê tudo (posts e jogos de todos os estúdios, banners, página About).
 * - Estúdio: vê só o que é dele (a API já devolve filtrado).
 * - "Precisa de atenção" lista o que falta arrumar (jogo sem imagem, post
 *   publicado com trecho do template, banner sem descrição...).
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BsArrowRight,
  BsBuilding,
  BsController,
  BsExclamationTriangle,
  BsFileText,
  BsImages,
  BsKey,
  BsLightningCharge,
  BsPencil,
  BsPeople,
  BsPlusLg,
  BsWindow,
} from 'react-icons/bs'
import AdminLayout from '../../components/Admin/AdminLayout'
import { Alert, EmptyState, Section, StatusBadge, Thumb } from '../../components/Admin/AdminUI'
import {
  colorHex,
  formatDateTime,
  gameStatus,
  hasTemplateLeftovers,
  isToday,
  plural,
  postStatus,
  timeAgo,
} from '../../components/Admin/AdminHelpers'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import { POST_TYPES } from '../../data/posts'
import '../../styles/globals.css'

const RECENT_LIMIT = 5

// ===============================================
// O QUE PRECISA DE ATENÇÃO
// ===============================================

/** Lista de pendências: [{ text, to }] */
function findIssues({ posts, games, banners, about, studio }, user) {
  const issues = []
  const editLink = (list, base, fallback) => (list.length === 1 ? `${base}/${list[0].id}` : fallback)

  // Jogos sem a imagem da vitrine
  const noImage = games.filter((g) => !g.characterImage)
  if (noImage.length) {
    issues.push({
      text: `${plural(noImage.length, 'jogo', 'jogos')} sem imagem da vitrine`,
      to: editLink(noImage, '/painel/jogos', '/painel/jogos'),
    })
  }

  // Posts que estão (ou vão estar) no site
  const live = posts.filter((p) => postStatus(p) !== 'draft')
  const leftovers = live.filter((p) => hasTemplateLeftovers(`${p.subtitle} ${p.body}`))
  if (leftovers.length) {
    issues.push({
      text: `${plural(leftovers.length, 'post publicado', 'posts publicados')} com trechos [ ] do template`,
      to: editLink(leftovers, '/painel/posts', '/painel/posts'),
    })
  }
  const noCover = live.filter((p) => !p.cover)
  if (noCover.length) {
    issues.push({
      text: `${plural(noCover.length, 'post publicado', 'posts publicados')} sem capa`,
      to: editLink(noCover, '/painel/posts', '/painel/posts'),
    })
  }

  // Só admin: banners e página About
  if (banners) {
    if (!banners.home?.length) issues.push({ text: 'Página inicial sem banner', to: '/painel/banners' })
    if (!banners.jogos?.length) issues.push({ text: 'Página de jogos sem banner', to: '/painel/banners' })
    const noAlt = [...(banners.home || []), ...(banners.jogos || [])].filter((b) => !b.alt?.trim())
    if (noAlt.length) {
      issues.push({ text: `${plural(noAlt.length, 'banner', 'banners')} sem descrição da imagem`, to: '/painel/banners' })
    }
  }
  if (about) {
    const missing = [0, 1].filter((i) => !about[i]?.image).length
    if (missing) {
      issues.push({ text: `${plural(missing, 'card', 'cards')} da página About sem imagem`, to: '/painel/sobre' })
    }
  }

  // Só estúdio: perfil do estúdio
  if (studio) {
    const to = `/painel/desenvolvedoras/${user.developerId}`
    if (!studio.logo) issues.push({ text: 'Perfil do estúdio sem logotipo', to })
    if (!studio.description?.trim()) issues.push({ text: 'Perfil do estúdio sem descrição', to })
  }

  return issues
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AdminOverview() {
  const { run, isAdmin, user } = useAuth()
  const location = useLocation()
  const [data, setData] = useState(null) // { posts, games, banners?, about?, studio? }
  const [error, setError] = useState('')
  // Recado vindo de outra página (ex.: "Essa página é só da equipe da Trevo.")
  const [message, setMessage] = useState(location.state?.message || '')

  // ---------- Carrega tudo de uma vez ----------
  useEffect(() => {
    const jobs = {
      posts: run((token) => api.admin.listPosts(token)),
      games: run((token) => api.admin.listGames(token)),
      banners: isAdmin ? run((token) => api.admin.getBanners(token)) : null,
      about: isAdmin ? run((token) => api.admin.getAboutCards(token)) : null,
      studio: isAdmin ? null : run((token) => api.admin.listDevelopers(token)).then((list) => list[0] || null),
    }
    const keys = Object.keys(jobs)
    Promise.allSettled(keys.map((key) => jobs[key])).then((results) => {
      const next = { posts: [], games: [] }
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') next[keys[i]] = result.value ?? next[keys[i]] ?? null
        else setError(result.reason.message)
      })
      setData(next)
    })
  }, [run, isAdmin])

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const greeting = isAdmin ? 'Olá, equipe Trevo' : `Olá, ${user?.developer?.name || 'estúdio'}`
  const studioLink = `/painel/desenvolvedoras/${user?.developerId}`

  const actions = (
    <>
      <Link to="/painel/jogos/novo" className="admin-btn admin-btn--ghost">
        <BsPlusLg aria-hidden="true" /> <span className="admin-btn-text">Novo jogo</span>
      </Link>
      <Link to="/painel/posts/novo" className="admin-btn admin-btn--primary">
        <BsPlusLg aria-hidden="true" /> <span className="admin-btn-text">Novo post</span>
      </Link>
    </>
  )

  if (!data) {
    return (
      <AdminLayout title={greeting} subtitle={`Resumo do site hoje, ${today}.`} crumbs={[{ label: 'Visão geral' }]} actions={actions}>
        <p className="admin-loading">Carregando o resumo...</p>
      </AdminLayout>
    )
  }

  const { posts, games, banners, studio } = data

  // ---------- Números ----------
  const byStatus = { published: 0, scheduled: 0, draft: 0 }
  posts.forEach((p) => (byStatus[postStatus(p)] += 1))
  const draftsToday = posts.filter((p) => postStatus(p) === 'draft' && isToday(p.updatedAt)).length
  const liveGames = games.filter((g) => gameStatus(g) === 'published').length
  const draftGames = games.length - liveGames

  const stats = [
    {
      label: 'Posts publicados',
      n: byStatus.published,
      hint: byStatus.scheduled ? plural(byStatus.scheduled, 'agendado', 'agendados') : 'nenhum agendado',
      icon: BsFileText,
      color: 'green',
      to: '/painel/posts',
      state: { filter: 'published' },
    },
    {
      label: 'Rascunhos de posts',
      n: byStatus.draft,
      hint: draftsToday ? `${plural(draftsToday, 'editado', 'editados')} hoje` : 'nenhum editado hoje',
      icon: BsPencil,
      color: 'gray',
      to: '/painel/posts',
      state: { filter: 'draft' },
    },
    {
      label: 'Jogos no site',
      n: liveGames,
      hint: draftGames ? plural(draftGames, 'rascunho', 'rascunhos') : 'nenhum rascunho',
      icon: BsController,
      color: 'orange',
      to: '/painel/jogos',
    },
    isAdmin
      ? {
          label: 'Banners no site',
          n: (banners?.home?.length || 0) + (banners?.jogos?.length || 0),
          hint: `Início ${banners?.home?.length || 0} · Jogos ${banners?.jogos?.length || 0}`,
          icon: BsImages,
          color: 'cyan',
          to: '/painel/banners',
        }
      : {
          label: 'Integrantes no perfil',
          n: studio?.members?.length || 0,
          hint: plural(studio?.socials?.length || 0, 'rede social', 'redes sociais'),
          icon: BsPeople,
          color: 'cyan',
          to: studioLink,
        },
  ]

  // ---------- Últimos itens mexidos (posts e jogos juntos) ----------
  const recent = [
    ...posts.map((p) => ({
      key: `post-${p.id}`,
      title: p.title,
      kind: `Post · ${POST_TYPES[p.type] || 'Post'}`,
      status: postStatus(p),
      when:
        postStatus(p) === 'scheduled' ? `sai em ${formatDateTime(p.publishedAt)}` : `editado ${timeAgo(p.updatedAt)}`,
      updatedAt: p.updatedAt,
      to: `/painel/posts/${p.id}`,
      thumb: imageUrl(p.cover),
    })),
    ...games.map((g) => ({
      key: `game-${g.id}`,
      title: g.title,
      kind: 'Jogo',
      status: gameStatus(g),
      when: `editado ${timeAgo(g.updatedAt)}`,
      updatedAt: g.updatedAt,
      to: `/painel/jogos/${g.id}`,
      thumb: imageUrl(g.characterImage),
      color: colorHex(g.color),
    })),
  ]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, RECENT_LIMIT)

  const issues = findIssues(data, user)

  const shortcuts = isAdmin
    ? [
        { to: '/painel/posts/novo', label: 'Novo post', icon: BsFileText },
        { to: '/painel/jogos/novo', label: 'Novo jogo', icon: BsController },
        { to: '/painel/banners', label: 'Trocar banners', icon: BsImages },
        { to: '/painel/sobre', label: 'Editar página About', icon: BsWindow },
      ]
    : [
        { to: '/painel/posts/novo', label: 'Novo post', icon: BsFileText },
        { to: '/painel/jogos/novo', label: 'Novo jogo', icon: BsController },
        { to: studioLink, label: 'Editar meu estúdio', icon: BsBuilding },
        { to: '/painel/conta', label: 'Trocar senha', icon: BsKey },
      ]

  return (
    <AdminLayout
      title={greeting}
      subtitle={`Resumo do site hoje, ${today}.`}
      crumbs={[{ label: 'Visão geral' }]}
      actions={actions}
      counts={{ posts: posts.length, games: games.length }}
    >
      {message && <Alert tone="info" onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {/* ========== NÚMEROS ========== */}
      <div className="admin-stats">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to} state={stat.state} className="admin-card admin-stat">
            <span className={`admin-stat-icon admin-chip--${stat.color}`} aria-hidden="true">
              <stat.icon />
            </span>
            <span className="admin-stat-text">
              <span className="admin-stat-label">{stat.label}</span>
              <span className="admin-stat-n">{stat.n}</span>
              <span className="admin-stat-hint">{stat.hint}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="admin-overview">
        {/* ========== CONTINUE DE ONDE PAROU ========== */}
        <Section
          title="Continue de onde parou"
          actions={
            <Link to="/painel/posts" className="admin-link">
              Ver todos os posts <BsArrowRight aria-hidden="true" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <EmptyState
              icon={BsFileText}
              title="Nada por aqui ainda"
              action={
                <Link to="/painel/posts/novo" className="admin-btn admin-btn--primary">
                  <BsPlusLg aria-hidden="true" /> Criar o primeiro post
                </Link>
              }
            >
              Os posts e jogos que você criar ou editar aparecem aqui.
            </EmptyState>
          ) : (
            <ul className="admin-recent">
              {recent.map((item) => (
                <li key={item.key}>
                  <Thumb src={item.thumb} color={item.color} contain={Boolean(item.color)} />
                  <span className="admin-recent-text">
                    <Link to={item.to} className="admin-recent-title">{item.title}</Link>
                    <span className="admin-recent-meta">
                      {item.kind} · {item.when}
                    </span>
                  </span>
                  <StatusBadge status={item.status} />
                  <span className="admin-recent-go" aria-hidden="true">
                    <BsPencil />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <div className="admin-stack">
          {/* ========== PRECISA DE ATENÇÃO ========== */}
          <Section
            title="Precisa de atenção"
            icon={BsExclamationTriangle}
            className={`admin-attention ${issues.length ? '' : 'admin-attention--ok'}`}
          >
            <ul className="admin-checklist">
              {issues.length === 0 && (
                <li>
                  <span className="admin-dot admin-dot--ok" aria-hidden="true" />
                  <span className="admin-checklist-text">Tudo certo: nada pendente no site.</span>
                </li>
              )}
              {issues.map((issue) => (
                <li key={issue.text}>
                  <span className="admin-dot admin-dot--warn" aria-hidden="true" />
                  <span className="admin-checklist-text">{issue.text}</span>
                  <Link to={issue.to} className="admin-link">
                    Resolver<span className="visually-hidden">: {issue.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>

          {/* ========== ATALHOS ========== */}
          <Section title="Atalhos" icon={BsLightningCharge}>
            <div className="admin-shortcuts">
              {shortcuts.map((s) => (
                <Link key={s.label} to={s.to} className="admin-shortcut">
                  <s.icon aria-hidden="true" /> {s.label}
                </Link>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </AdminLayout>
  )
}