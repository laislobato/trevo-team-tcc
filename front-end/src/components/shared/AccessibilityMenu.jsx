/**
 * COMPONENTE: AccessibilityMenu
 * =============================
 * Bolinha fixa no canto de baixo, à direita, que abre o painel de
 * acessibilidade. Aparece em todas as páginas (site, login e painel).
 *
 *   ┌ ACESSIBILIDADE ─────────────── ✕ ┐
 *   │ TEMA          [Claro|Escuro|Auto] │
 *   │ TAMANHO DO TEXTO   A−  115%  A+   │
 *   │ VISÃO         Alto contraste  ( ) │
 *   │               Destacar links  ( ) │
 *   │               Fonte legível   ( ) │
 *   │ LEITURA       Mais espaço     ( ) │
 *   │               Reduzir animações ( )│
 *   │               Foco reforçado  ( ) │
 *   │ ↺ Restaurar padrão   Salvo aqui   │
 *   └──────────────────────────────────┘
 *                                    (♿)
 *
 * - Cada mudança vale na hora e fica salva no navegador
 *   (services/acessibilidade.js).
 * - Esc, o ✕ ou clicar fora fecham o painel; o foco volta para a bolinha.
 * - No celular, o painel sobe de baixo, ocupando a largura da tela.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect, useId, useRef, useState } from 'react'
import {
  BsArrowCounterclockwise,
  BsCircleHalf,
  BsMoonStars,
  BsSun,
  BsUniversalAccess,
  BsXLg,
} from 'react-icons/bs'
import { DEFAULTS, TEXT_SIZES, loadSettings, saveSettings } from '../../services/acessibilidade'
import './css/AccessibilityMenu.css'

const THEMES = [
  { id: 'claro', label: 'Claro', icon: BsSun },
  { id: 'escuro', label: 'Escuro', icon: BsMoonStars },
  { id: 'auto', label: 'Automático', icon: BsCircleHalf },
]

// Opções liga/desliga, em dois grupos
const GROUPS = [
  {
    title: 'Visão',
    options: [
      { key: 'contraste', label: 'Alto contraste', hint: 'Preto, branco e amarelo, com bordas fortes (vale mais que o tema)' },
      { key: 'links', label: 'Destacar links', hint: 'Sublinha todos os links e botões' },
      { key: 'fonte', label: 'Fonte mais legível', hint: 'Letras mais abertas, boa para dislexia' },
    ],
  },
  {
    title: 'Leitura e movimento',
    options: [
      { key: 'espaco', label: 'Mais espaço entre linhas', hint: 'Linhas, letras e palavras mais afastadas' },
      { key: 'movimento', label: 'Reduzir animações', hint: 'Para carrosséis, faixas e efeitos' },
      { key: 'foco', label: 'Foco reforçado', hint: 'Contorno grosso no que estiver selecionado pelo Tab' },
    ],
  },
]

// ===============================================
// CHAVE LIGA/DESLIGA
// ===============================================

function Toggle({ label, hint, on, onChange }) {
  const id = useId()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={`${id}-rotulo`}
      aria-describedby={`${id}-dica`}
      className="a11y-row"
      onClick={() => onChange(!on)}
    >
      <span className="a11y-row-text">
        <span className="a11y-row-label" id={`${id}-rotulo`}>{label}</span>
        <span className="a11y-row-hint" id={`${id}-dica`}>{hint}</span>
      </span>
      <span className={`a11y-switch ${on ? 'is-on' : ''}`} aria-hidden="true">
        <span />
      </span>
    </button>
  )
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState(loadSettings)
  const [announce, setAnnounce] = useState('') // lido pelo leitor de tela
  const fabRef = useRef(null)
  const panelRef = useRef(null)
  const id = useId()

  // Muda uma (ou mais) opções: aplica e salva na hora
  const update = (patch, message) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
    if (message) setAnnounce(message)
  }

  const close = () => {
    setOpen(false)
    fabRef.current?.focus()
  }

  // ---------- Aberto: foco no painel, Esc e clique fora fecham ----------
  useEffect(() => {
    if (!open) return undefined
    panelRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    const onPointer = (e) => {
      if (panelRef.current?.contains(e.target) || fabRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // ---------- Tamanho do texto ----------
  const sizeIndex = TEXT_SIZES.indexOf(settings.texto)
  const changeSize = (step) => {
    const texto = TEXT_SIZES[sizeIndex + step]
    if (texto) update({ texto }, `Texto em ${texto}%`)
  }

  const reset = () => {
    setSettings(DEFAULTS)
    saveSettings(DEFAULTS)
    setAnnounce('Opções de acessibilidade restauradas')
  }

  return (
    <>
      {open && (
        <>
          {/* Fundo escuro atrás do painel (só no celular) */}
          <div className="a11y-backdrop" aria-hidden="true"></div>

          <section
            className="a11y-panel"
            id={`${id}-painel`}
            role="dialog"
            aria-labelledby={`${id}-titulo`}
            tabIndex={-1}
            ref={panelRef}
          >
            <header className="a11y-head">
              <span className="a11y-head-icon" aria-hidden="true"><BsUniversalAccess /></span>
              <h2 className="a11y-title" id={`${id}-titulo`}>Acessibilidade</h2>
              <button type="button" className="a11y-close" onClick={close} aria-label="Fechar acessibilidade">
                <BsXLg aria-hidden="true" />
              </button>
            </header>

            <div className="a11y-body">
              {/* ---------- Tema ---------- */}
              <p className="a11y-label" id={`${id}-tema`}>Tema</p>
              <div className="a11y-seg" role="radiogroup" aria-labelledby={`${id}-tema`}>
                {THEMES.map((theme) => (
                  <label key={theme.id} className={`a11y-seg-option ${settings.tema === theme.id ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name={`${id}-tema`}
                      value={theme.id}
                      checked={settings.tema === theme.id}
                      onChange={() => update({ tema: theme.id }, `Tema ${theme.label.toLowerCase()}`)}
                      className="a11y-sr"
                    />
                    <theme.icon aria-hidden="true" /> {theme.label}
                  </label>
                ))}
              </div>
              {settings.contraste && (
                <p className="a11y-note">O alto contraste está ligado e vale no lugar do tema.</p>
              )}

              {/* ---------- Tamanho do texto ---------- */}
              <p className="a11y-label" id={`${id}-texto`}>Tamanho do texto</p>
              <div className="a11y-size" role="group" aria-labelledby={`${id}-texto`}>
                <button type="button" className="a11y-size-btn" onClick={() => changeSize(-1)}
                  disabled={sizeIndex <= 0} aria-label="Diminuir o texto">
                  A−
                </button>
                <div className="a11y-size-mid">
                  <strong>{settings.texto}%</strong>
                  <span className="a11y-dots" aria-hidden="true">
                    {TEXT_SIZES.map((size, i) => (
                      <i key={size} className={i <= sizeIndex ? 'on' : ''} />
                    ))}
                  </span>
                </div>
                <button type="button" className="a11y-size-btn a11y-size-btn--big" onClick={() => changeSize(1)}
                  disabled={sizeIndex >= TEXT_SIZES.length - 1} aria-label="Aumentar o texto">
                  A+
                </button>
              </div>

              {/* ---------- Liga/desliga ---------- */}
              {GROUPS.map((group) => (
                <div key={group.title} role="group" aria-label={group.title}>
                  <p className="a11y-label" aria-hidden="true">{group.title}</p>
                  {group.options.map((option) => (
                    <Toggle
                      key={option.key}
                      label={option.label}
                      hint={option.hint}
                      on={settings[option.key]}
                      onChange={(value) => update({ [option.key]: value }, `${option.label} ${value ? 'ligado' : 'desligado'}`)}
                    />
                  ))}
                </div>
              ))}
            </div>

            <footer className="a11y-foot">
              <button type="button" className="a11y-reset" onClick={reset}>
                <BsArrowCounterclockwise aria-hidden="true" /> Restaurar padrão
              </button>
              <span className="a11y-saved">Salvo neste navegador</span>
            </footer>
          </section>
        </>
      )}

      {/* Bolinha */}
      <button
        type="button"
        ref={fabRef}
        className={`a11y-fab ${open ? 'is-open' : ''}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={open ? `${id}-painel` : undefined}
        aria-label="Acessibilidade"
        title="Acessibilidade"
      >
        <BsUniversalAccess aria-hidden="true" />
      </button>

      {/* Avisos para leitor de tela ("Texto em 130%", "Tema escuro") */}
      <p className="a11y-sr" aria-live="polite">{announce}</p>
    </>
  )
}