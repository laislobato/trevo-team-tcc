/**
 * PÁGINA: NotFound (erro 404)
 * ===========================
 * Aparece quando o endereço não existe no site (rota "*" do App.jsx).
 *
 *   ┌──────────────────── bloco ciano ────────────────────┐
 *   │  ★                                            ★     │
 *   │                 4  ( ★ )  4                         │  <- o "0" é o lugar do mascote
 *   │            PÁGINA NÃO ENCONTRADA                    │
 *   │     Essa fase não existe... Endereço: /abc          │
 *   │              [ ⌂ VOLTAR AO INÍCIO ]                 │
 *   │      Ou vá direto para: Games · Blog · Contact Us · FAQ
 *   └─────────────────────────────────────────────────────┘
 *   Footer
 *
 * - O "0" do 404 é um círculo verde com uma estrela no meio. Quando a
 *   arte do mascote existir, coloque a imagem em MASCOT_ART (abaixo).
 * - Os números grandes são só enfeite (o leitor de tela pula); o título
 *   da página é o "PÁGINA NÃO ENCONTRADA".
 * - As páginas de um jogo e de um post têm a mensagem própria de
 *   "não encontrado" (GamePage e BlogPost); esta é para o resto.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BsHouseDoor } from 'react-icons/bs'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import Art from '../components/shared/Art'
import '../styles/globals.css'
import '../components/NotFound/css/NotFound.css'

// ===============================================
// TEXTOS E LINKS
// ===============================================

// Arte do mascote no lugar do "0" (vazio = estrela).
// Ex.: import mascote from '../assets/mascote-404.png'  ->  const MASCOT_ART = mascote
const MASCOT_ART = ''

// Atalhos embaixo do botão ("to" = rota do App.jsx)
const shortcuts = [
  { label: 'Games', to: '/jogo' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact Us', to: '/contato' },
  { label: 'FAQ', to: '/blog?aba=faq' },
]

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function NotFound() {
  // Endereço que a pessoa tentou abrir (aparece no texto)
  const { pathname } = useLocation()

  // Título da aba do navegador
  useEffect(() => {
    document.title = 'Página não encontrada | Trevo Team'
  }, [])

  return (
    <div className="notfound-page">
      {/* ========== CABEÇALHO POR CIMA DO BLOCO CIANO ========== */}
      <div className="page-top">
        <Header flat />

        <section className="notfound" aria-labelledby="notfound-title">
          {/* Estrelas de enfeite espalhadas */}
          <Art size={64} color="orange" className="notfound-star notfound-star--1" />
          <Art size={36} color="green" className="notfound-star notfound-star--2" />
          <Art size={28} color="black" className="notfound-star notfound-star--3" />

          <div className="notfound-inner">
            {/* ========== 404 (só enfeite) ========== */}
            <div className="notfound-code" aria-hidden="true">
              <span className="notfound-digit">4</span>
              <span className="notfound-zero">
                <Art src={MASCOT_ART} size={120} color="orange" className="notfound-mascot" />
              </span>
              <span className="notfound-digit">4</span>
            </div>

            {/* ========== MENSAGEM ========== */}
            <h1 id="notfound-title" className="notfound-title">PÁGINA NÃO ENCONTRADA</h1>
            <p className="notfound-text">
              Essa fase não existe (pelo menos por enquanto). O endereço pode estar errado ou a página mudou de
              lugar.
            </p>
            <p className="notfound-path">
              Endereço: <code>{pathname}</code>
            </p>

            {/* ========== SAÍDAS ========== */}
            <Link to="/" className="notfound-button">
              <BsHouseDoor aria-hidden="true" />
              VOLTAR AO INÍCIO
            </Link>

            <nav className="notfound-links" aria-label="Outras páginas do site">
              <p className="notfound-links-label">Ou vá direto para:</p>
              <ul>
                {shortcuts.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="notfound-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </div>

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}