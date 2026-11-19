/**
 * DADOS: perguntas frequentes
 * ===========================
 * Uma lista só, usada em dois lugares:
 * - aba FAQ do Blog: todas as perguntas, separadas por tema;
 * - página Contact: só as que têm "destaque: true".
 *
 * Campos de cada pergunta:
 * - question: a pergunta
 * - answer:   a resposta
 * - category: tema (um dos "id" de faqCategories, abaixo)
 * - destaque: true = aparece também na página Contact
 *
 * Edite, inclua ou remova perguntas aqui. A ordem da lista é a ordem na tela
 * (dentro de cada tema).
 */

// Temas, na ordem em que aparecem no Blog
export const faqCategories = [
  { id: 'site', label: 'O site' },
  { id: 'suporte', label: 'Suporte' },
  { id: 'parcerias', label: 'Parcerias' },
]

export const faq = [
  // ========== O SITE ==========
  {
    question: 'A Trevo Team vende jogos?',
    answer:
      'Não. A Trevo Team divulga os jogos e as campanhas de financiamento, e leva você até a loja ou a plataforma de cada jogo. Nenhum pagamento é feito pelo nosso site.',
    category: 'site',
  },
  {
    question: 'Preciso criar uma conta para usar o site?',
    answer:
      'Não. Todo o conteúdo é aberto. O único login do site é o da equipe da Trevo Team, usado para publicar os posts.',
    category: 'site',
  },

  // ========== SUPORTE ==========
  {
    question: 'Quanto tempo leva para responderem?',
    // EXEMPLO: troque pelo prazo real (o mesmo de RESPONSE_TIME em pages/Contact.jsx)
    answer:
      'Respondemos em até 2 dias úteis. Mensagens de suporte têm prioridade e costumam ser respondidas antes.',
    category: 'suporte',
    destaque: true,
  },
  {
    question: 'Como peço suporte?',
    answer:
      'Pela página Contact Us: escolha o assunto "Suporte", descreva o problema e envie. A resposta chega no seu e-mail.',
    category: 'suporte',
  },
  {
    question: 'Comprei um jogo e ele não abre. O que faço?',
    answer:
      'Escolha o assunto "Suporte" na página Contact Us e conte qual é o jogo, em qual plataforma e o que aparece na tela.',
    category: 'suporte',
    destaque: true,
  },

  // ========== PARCERIAS ==========
  {
    question: 'Sou desenvolvedor. Como apresento meu jogo?',
    answer:
      'Envie uma mensagem pela página Contact Us com o assunto "Parcerias", contando sobre o projeto e com um link de demonstração, se tiver.',
    category: 'parcerias',
  },
  {
    question: 'O que preciso enviar numa proposta de jogo?',
    answer:
      'O nome e o gênero do jogo, em que fase ele está, um link de vídeo, demo ou página, e do que vocês precisam: divulgação, financiamento ou os dois.',
    category: 'parcerias',
    destaque: true,
  },
  {
    question: 'Vocês trabalham com estúdios de fora do Brasil?',
    answer: 'Sim. Pode mandar a proposta em português ou em inglês.',
    category: 'parcerias',
    destaque: true,
  },
]