/**
 * PÁGINA: Privacy (Política de privacidade)
 * =========================================
 * Política de privacidade da Trevo Team, na rota /privacidade
 * (link "Privacy" do rodapé). Explica quais dados o site usa, para quê,
 * por quanto tempo e como pedir acesso, correção ou exclusão (LGPD).
 *
 * Estrutura (de cima para baixo):
 * - Header (flutua por cima do bloco ciano)
 * - PrivacyHero    -> título, texto de abertura e data da última mudança
 * - PrivacySummary -> o resumo em quatro cards
 * - Duas colunas:
 *     esquerda: PrivacyNav (sumário) + PrivacyHelp (fica parado ao rolar)
 *     direita:  as seções (PrivacySection), uma embaixo da outra
 * - Footer
 *
 * No celular: uma coluna (sumário, seções e a caixa PrivacyHelp no fim).
 *
 * Todo o TEXTO fica em src/data/privacy.js: para mudar a política,
 * edite só aquele arquivo.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import { useEffect } from 'react'
import Header from '../components/shared/Header'
import Footer from '../components/shared/Footer'
import PrivacyHero from '../components/Privacy/PrivacyHero'
import PrivacySummary from '../components/Privacy/PrivacySummary'
import PrivacyNav from '../components/Privacy/PrivacyNav'
import PrivacySection from '../components/Privacy/PrivacySection'
import PrivacyHelp from '../components/Privacy/PrivacyHelp'
import { PRIVACY_EMAIL, updatedAt, intro, summary, dataUses, sections } from '../data/privacy'
import '../styles/globals.css'
import '../components/Privacy/css/Privacy.css'

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function Privacy() {
  // Título da aba do navegador
  useEffect(() => {
    document.title = 'Política de privacidade | Trevo Team'
  }, [])

  return (
    <div className="privacy-page">
      {/* ========== CABEÇALHO POR CIMA DO BLOCO CIANO ========== */}
      <div className="page-top">
        <Header flat />
        <PrivacyHero intro={intro} updatedAt={updatedAt} />
      </div>

      {/* ========== RESUMO EM QUATRO CARDS ========== */}
      <PrivacySummary items={summary} />

      {/* ========== SUMÁRIO + TEXTO ========== */}
      <div className="privacy-body">
        <aside className="privacy-aside">
          <PrivacyNav sections={sections} />
          <PrivacyHelp email={PRIVACY_EMAIL} className="privacy-help--aside" />
        </aside>

        <div className="privacy-content">
          {sections.map((section, index) => (
            <PrivacySection
              key={section.id}
              section={section}
              number={index + 1}
              email={PRIVACY_EMAIL}
              dataUses={dataUses}
            />
          ))}

          {/* No celular, a caixa de dúvidas fica no fim do texto */}
          <PrivacyHelp email={PRIVACY_EMAIL} className="privacy-help--end" />
        </div>
      </div>

      {/* ========== RODAPÉ ========== */}
      <Footer />
    </div>
  )
}