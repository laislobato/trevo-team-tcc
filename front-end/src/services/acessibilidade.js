/**
 * SERVIÇO: acessibilidade
 * =======================
 * Guarda as escolhas do menu de acessibilidade e aplica no site inteiro
 * (inclusive no painel), marcando atributos na tag <html>:
 *
 *   <html data-tema="escuro" data-texto="130" data-contraste="alto"
 *         data-links="destacar" data-fonte="legivel" data-espaco="amplo"
 *         data-movimento="reduzido" data-foco="reforcado">
 *
 * O visual de cada atributo fica em styles/acessibilidade.css.
 * As escolhas ficam salvas no navegador (localStorage) e são aplicadas
 * assim que este arquivo carrega, antes de a página aparecer.
 *
 * Uso nos componentes:
 *   import { prefersReducedMotion } from '../../services/acessibilidade'
 *   if (!prefersReducedMotion()) { ...anima... }
 */

const STORAGE_KEY = 'trevo-acessibilidade'
const CHANGE_EVENT = 'trevo:acessibilidade'

/** Tamanhos do texto (em %) */
export const TEXT_SIZES = [100, 115, 130, 150]

/**
 * Como o site começa. tema: 'claro' | 'escuro' | 'auto'
 * (para seguir o tema do celular/computador por padrão, troque para 'auto')
 */
export const DEFAULTS = {
  tema: 'claro',
  texto: 100,
  contraste: false,
  links: false,
  fonte: false,
  espaco: false,
  movimento: false,
  foco: false,
}

// Preferências do sistema (celular/computador)
const darkQuery = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-color-scheme: dark)') : null
const motionQuery = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-reduced-motion: reduce)') : null

// ===============================================
// LER E SALVAR
// ===============================================

/** Escolhas salvas (ou o padrão). Valores estranhos voltam para o padrão. */
export function loadSettings() {
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}
  } catch {
    saved = {} // modo privado ou valor quebrado
  }
  const settings = { ...DEFAULTS }
  if (['claro', 'escuro', 'auto'].includes(saved.tema)) settings.tema = saved.tema
  if (TEXT_SIZES.includes(saved.texto)) settings.texto = saved.texto
  for (const key of ['contraste', 'links', 'fonte', 'espaco', 'movimento', 'foco']) {
    if (typeof saved[key] === 'boolean') settings[key] = saved[key]
  }
  return settings
}

/** Salva, aplica e avisa os componentes */
export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* sem armazenamento: vale só até recarregar a página */
  }
  applySettings(settings)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: settings }))
}

// ===============================================
// APLICAR NA PÁGINA
// ===============================================

/** 'auto' vira 'claro' ou 'escuro' conforme o sistema */
export const resolveTheme = (tema) => (tema === 'auto' ? (darkQuery?.matches ? 'escuro' : 'claro') : tema)

/** Marca (ou tira) os atributos na tag <html> */
export function applySettings(settings) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const set = (name, value) => {
    if (value) root.setAttribute(`data-${name}`, value)
    else root.removeAttribute(`data-${name}`)
  }
  set('tema', resolveTheme(settings.tema))
  set('texto', settings.texto !== 100 ? String(settings.texto) : '')
  set('contraste', settings.contraste ? 'alto' : '')
  set('links', settings.links ? 'destacar' : '')
  set('fonte', settings.fonte ? 'legivel' : '')
  set('espaco', settings.espaco ? 'amplo' : '')
  set('movimento', settings.movimento ? 'reduzido' : '')
  set('foco', settings.foco ? 'reforcado' : '')
  if (settings.fonte) loadLegibleFont()
}

/** A fonte mais legível (Atkinson Hyperlegible) só é baixada quando alguém liga a opção */
function loadLegibleFont() {
  if (document.getElementById('fonte-legivel')) return
  const link = document.createElement('link')
  link.id = 'fonte-legivel'
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap'
  document.head.appendChild(link)
}

/** Avisa quando as escolhas mudam (devolve a função para parar de ouvir) */
export function onSettingsChange(callback) {
  const handler = (e) => callback(e.detail)
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}

/**
 * true se é para reduzir animações: pela opção do menu
 * ou pelo "reduzir movimento" do sistema.
 */
export const prefersReducedMotion = () =>
  typeof document !== 'undefined' &&
  (document.documentElement.dataset.movimento === 'reduzido' || Boolean(motionQuery?.matches))

// ===============================================
// AO CARREGAR
// ===============================================

if (typeof window !== 'undefined') {
  applySettings(loadSettings())
  // Tema "Automático": acompanha quando o sistema troca de claro para escuro
  darkQuery?.addEventListener?.('change', () => {
    const settings = loadSettings()
    if (settings.tema === 'auto') applySettings(settings)
  })
}