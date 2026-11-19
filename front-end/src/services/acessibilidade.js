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
 * Reduzir animações: quem decide é a opção do menu. Ela já começa ligada
 * quando o computador/celular pede menos movimento, mas a pessoa pode
 * desligar no menu e as animações voltam.
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
 * "movimento" não é usado direto: o padrão dele vem do sistema
 * (ver defaultSettings, abaixo).
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

/** true se o computador/celular pede menos movimento */
const systemReducesMotion = () => Boolean(motionQuery?.matches)

/** Padrão do site: o de DEFAULTS, com "Reduzir animações" igual ao do sistema */
export const defaultSettings = () => ({ ...DEFAULTS, movimento: systemReducesMotion() })

/** Lê o que está salvo no navegador (ou {} se não tiver nada) */
function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}
  } catch {
    return {} // modo privado ou valor quebrado
  }
}

// ===============================================
// LER E SALVAR
// ===============================================

/** Escolhas salvas (ou o padrão). Valores estranhos voltam para o padrão. */
export function loadSettings() {
  const saved = readSaved()
  const settings = defaultSettings()
  if (['claro', 'escuro', 'auto'].includes(saved.tema)) settings.tema = saved.tema
  if (TEXT_SIZES.includes(saved.texto)) settings.texto = saved.texto
  for (const key of ['contraste', 'links', 'fonte', 'espaco', 'movimento', 'foco']) {
    if (typeof saved[key] === 'boolean') settings[key] = saved[key]
  }
  return settings
}

/** Salva, aplica e avisa os componentes */
export function saveSettings(settings) {
  // "Reduzir animações" igual ao do sistema não é guardado: assim o site
  // continua acompanhando o sistema. Diferente (a pessoa escolheu no menu),
  // é guardado e vale mais que o sistema.
  const toSave = { ...settings }
  if (toSave.movimento === systemReducesMotion()) delete toSave.movimento
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
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
 * true se é para reduzir animações (opção "Reduzir animações" ligada).
 * O sistema já entra nessa conta: ele decide como a opção começa.
 */
export const prefersReducedMotion = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.movimento === 'reduzido'

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
  // "Reduzir movimento" do sistema mudou: o site acompanha, se a pessoa
  // não tiver escolhido outra coisa no menu
  motionQuery?.addEventListener?.('change', () => {
    if (typeof readSaved().movimento === 'boolean') return
    const settings = loadSettings()
    applySettings(settings)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: settings }))
  })
}