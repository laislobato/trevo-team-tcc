/**
 * AJUDANTES DO PAINEL
 * ===================
 * Funções e hooks usados por várias telas do painel (nada de visual aqui).
 *
 * - postStatus / gameStatus: situação que aparece nas etiquetas
 * - normalize:               texto para a busca (sem acento e minúsculo)
 * - timeAgo / formatDateTime: datas em texto ("há 2 horas", "20/11, 10:00")
 * - plural:                  "1 post" / "3 posts"
 * - colorHex:                cor de fundo do jogo
 * - initials:                letras do avatar ("Orvalho Studio" -> "OS")
 * - useLeaveWarning:         avisa ao fechar a aba com mudanças não salvas
 * - usePagination:           divide uma lista em páginas
 */

import { useEffect, useState } from 'react'
import { GAME_COLORS } from '../../data/gameOptions'

// ===============================================
// SITUAÇÃO (etiquetas)
// ===============================================

/** Post: 'draft' (rascunho), 'scheduled' (agendado) ou 'published' (publicado) */
export function postStatus(post) {
  if (post.status === 'rascunho') return 'draft'
  if (post.publishedAt && new Date(post.publishedAt) > new Date()) return 'scheduled'
  return 'published'
}

/** Jogo: 'published' ou 'draft' */
export const gameStatus = (game) => (game.status === 'publicado' ? 'published' : 'draft')

/** Cor de fundo do jogo (vitrine e miniatura) */
export const colorHex = (id) => GAME_COLORS.find((c) => c.id === id)?.hex || '#d9d9d9'

// ===============================================
// TEXTO
// ===============================================

/** Para a busca: "Maré Alta" e "mare alta" ficam iguais */
export const normalize = (text = '') =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** plural(1, 'post', 'posts') -> "1 post" */
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/** Letras do avatar: "Orvalho Studio" -> "OS" */
export const initials = (text = '') =>
  text
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

/** Nome que vai no avatar do login */
export const avatarName = (user, isAdmin) => (isAdmin ? 'Equipe Trevo' : user?.developer?.name || user?.email || '')

/** Tem trecho do template ainda entre [ ]? */
export const hasTemplateLeftovers = (text = '') => /\[[^\]]+\]/.test(text)

// ===============================================
// DATAS
// ===============================================

/** "20/11, 10:00" */
export function formatDateTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${time}`
}

/** "agora há pouco", "há 5 minutos", "há 2 horas", "ontem", "em 15/11/2026" */
export function timeAgo(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const minutes = Math.round((Date.now() - date.getTime()) / 60000)
  if (minutes < 2) return 'agora há pouco'
  if (minutes < 60) return `há ${minutes} minutos`
  const hours = Math.round(minutes / 60)
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  if (sameDay) return hours === 1 ? 'há 1 hora' : `há ${hours} horas`
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'ontem'
  return `em ${date.toLocaleDateString('pt-BR')}`
}

/** Foi mexido hoje? */
export const isToday = (iso) => Boolean(iso) && new Date(iso).toDateString() === new Date().toDateString()

// ===============================================
// HOOKS
// ===============================================

/**
 * Com mudanças não salvas, o navegador pergunta antes de fechar
 * ou recarregar a aba. (Os links do menu perguntam pelo AdminLayout.)
 */
export function useLeaveWarning(active) {
  useEffect(() => {
    if (!active) return undefined
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = '' // necessário em alguns navegadores
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [active])
}

/**
 * Divide a lista em páginas.
 * resetKey: quando muda (ex.: a busca ou o filtro), volta para a página 1.
 *
 *   const pager = usePagination(lista, 10, `${busca}|${filtro}`)
 *   pager.items -> itens da página atual
 */
export function usePagination(list, pageSize, resetKey = '') {
  const [state, setState] = useState({ page: 1, key: resetKey })
  // Busca ou filtro mudou: volta para a página 1 (ajuste feito durante a renderização)
  if (state.key !== resetKey) setState({ page: 1, key: resetKey })

  const pages = Math.max(1, Math.ceil(list.length / pageSize))
  const wanted = state.key === resetKey ? state.page : 1
  const page = Math.min(wanted, pages) // ex.: apagou o último item da última página
  const start = (page - 1) * pageSize

  return {
    page,
    pages,
    total: list.length,
    from: list.length ? start + 1 : 0,
    to: Math.min(start + pageSize, list.length),
    items: list.slice(start, start + pageSize),
    setPage: (n) => setState({ page: n, key: resetKey }),
  }
}