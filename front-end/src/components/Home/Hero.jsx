/**
 * COMPONENTE: Hero (carrossel de banners)
 * =======================================
 * Bloco ciano grande logo abaixo do cabeçalho, na página inicial.
 * Mostra um banner por vez; as barrinhas de baixo indicam qual está na tela
 * (a verde é a atual) e levam direto ao banner clicado.
 *
 *   [                     banner                      ]
 *            ▬▬  ▬▬(verde)  ▬▬  ▬▬  ▬▬  ▬▬
 *
 * - Troca sozinho a cada 6 segundos (para quando o mouse está em cima
 *   ou quando a pessoa está navegando pelo teclado).
 * - No celular, dá para arrastar o dedo para o lado.
 * - Quem ativa "reduzir movimento" no sistema não tem troca automática.
 *
 * Controles: setas ‹ › nas laterais, barrinhas embaixo, arrastar no celular.
 *
 * De onde vêm os banners:
 * - Com a prop "page" ('home' ou 'jogos'), o carrossel busca os banners
 *   cadastrados pela Trevo no painel (Painel → Banners).
 * - Se o painel ainda não tiver banners para a página (ou a API falhar),
 *   usa a prop "banners"; sem ela, usa DEFAULT_BANNERS abaixo.
 *
 * Props:
 * - page:    'home' | 'jogos' -> qual lista do painel usar
 * - banners: lista reserva [{ image, alt, link }]
 * - label:   nome do carrossel lido pelos leitores de tela
 *   ex.: <Hero page="home" />                                (página inicial)
 *        <Hero page="jogos" label="Jogos em destaque" />      (página /jogo)
 *
 * "link" é opcional: página do site (/jogo/...) ou endereço completo (https://...,
 * abre em outra aba).
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import './css/Hero.css'

const DEFAULT_BANNERS = [
  { image: '', alt: 'Banner 1', link: '' },
  { image: '', alt: 'Banner 2', link: '' },
  { image: '', alt: 'Banner 3', link: '' },
  { image: '', alt: 'Banner 4', link: '' },
  { image: '', alt: 'Banner 5', link: '' },
  { image: '', alt: 'Banner 6', link: '' },
]

// Mostrado enquanto os banners do painel carregam (bloco ciano vazio)
const LOADING_BANNERS = [{ image: '', alt: 'Carregando banners', link: '' }]

const AUTOPLAY_MS = 6000

// true se a pessoa pediu para reduzir animações no sistema
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Hero({ page, banners: fallback = DEFAULT_BANNERS, label = 'Destaques da Trevo Team' }) {
  // Banners do painel: null = carregando | [] = nenhum (usa a lista reserva)
  const [remote, setRemote] = useState(page ? null : [])
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)

  // ---------- Busca os banners do painel ----------
  useEffect(() => {
    if (!page) return
    let active = true
    api
      .getBanners(page)
      .then((list) => active && setRemote(list))
      .catch(() => active && setRemote([])) // API fora do ar: usa a lista reserva
    return () => {
      active = false
    }
  }, [page])

  const banners = remote === null ? LOADING_BANNERS : remote.length ? remote : fallback
  const total = banners.length

  // Lista mudou de tamanho (ex.: chegaram os banners do painel): volta para o 1º
  useEffect(() => {
    setCurrent(0)
  }, [total])

  const goTo = (index) => setCurrent((index + total) % total)

  // Troca automática
  useEffect(() => {
    if (paused || total < 2 || prefersReducedMotion()) return
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % total), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [current, paused, total])

  // Arrastar no celular: mais de 50px para o lado troca de banner
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const distance = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(distance) > 50) goTo(current + (distance < 0 ? 1 : -1))
    touchStartX.current = null
  }

  return (
    <section
      className="hero"
      aria-roledescription="carrossel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 🖼️ FAIXA COM TODOS OS BANNERS (desliza para o lado) */}
      <div className="hero-viewport">
        <div className="hero-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {banners.map((banner, index) => {
            const content = banner.image ? (
              <img src={banner.image} alt={banner.alt} className="hero-image" />
            ) : (
              <span className="visually-hidden">{banner.alt}</span>
            )
            return (
              <div
                key={index}
                className="hero-slide"
                role="group"
                aria-roledescription="banner"
                aria-label={`${index + 1} de ${total}`}
                aria-hidden={index !== current}
              >
                {/* Link: página do site (Link) ou site de fora (abre em outra aba) */}
                {banner.link && /^https?:\/\//.test(banner.link) ? (
                  <a href={banner.link} target="_blank" rel="noreferrer" className="hero-slide-link"
                    tabIndex={index === current ? 0 : -1}>
                    {content}
                  </a>
                ) : banner.link ? (
                  <Link to={banner.link} className="hero-slide-link" tabIndex={index === current ? 0 : -1}>
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ‹ › SETAS: banner anterior e próximo (só com 2 ou mais) */}
      {total > 1 && (
        <>
          <button type="button" className="hero-arrow hero-arrow--prev" onClick={() => goTo(current - 1)}
            aria-label="Banner anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="hero-arrow hero-arrow--next" onClick={() => goTo(current + 1)}
            aria-label="Próximo banner">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* ▬ BARRINHAS: qual banner está na tela (só com 2 ou mais) */}
      {total > 1 && (
        <div className="hero-dots">
          {banners.map((banner, index) => (
            <button
              key={index}
              type="button"
              className={`hero-dot ${index === current ? 'is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Mostrar banner ${index + 1}`}
              aria-current={index === current}
            />
          ))}
        </div>
      )}
    </section>
  )
}