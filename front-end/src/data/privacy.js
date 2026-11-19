/**
 * DADOS: política de privacidade
 * ==============================
 * Todo o texto da página /privacidade fica aqui. A página
 * (pages/Privacy.jsx) só monta o visual.
 *
 * ⚠️ PROVISÓRIO: antes de publicar o site de verdade,
 * - o e-mail é fictício, como o próprio site (é o mesmo da página Contact);
 * - confira os prazos de "Por quanto tempo" (estão como EXEMPLO);
 * - valide a base legal de cada dado com o professor orientador
 *   ou com orientação jurídica;
 * - quando mudar o texto, atualize a data de "updatedAt".
 *
 * Como escrever os textos:
 * - {email} vira o link do e-mail de privacidade;
 * - [texto](endereço) vira um link. Endereço começando com "/"
 *   é uma página do site; com "https://", abre em outra aba.
 */

// ===============================================
// INFORMAÇÕES GERAIS
// ===============================================

// E-mail para assuntos de privacidade (fictício, o mesmo da Contact)
export const PRIVACY_EMAIL = 'contato@trevoteam.com'

// Data da última mudança no texto
export const updatedAt = '19 de novembro de 2026'

// Texto de abertura (embaixo do título)
export const intro =
  'Aqui você descobre, sem juridiquês, quais dados a Trevo Team usa, para quê, por quanto tempo e como pedir para ver, corrigir ou apagar os seus. Tudo segue a Lei Geral de Proteção de Dados (LGPD).'

// ===============================================
// RESUMO RÁPIDO (os quatro cards do topo)
// ===============================================
// icon: nome do ícone (ver components/Privacy/PrivacySummary.jsx)

export const summary = [
  {
    icon: 'browse',
    title: 'Navegue sem cadastro',
    text: 'Para ver os jogos, o blog e as outras páginas, você não precisa dar nenhum dado.',
  },
  {
    icon: 'cookie',
    title: 'Sem cookies nem rastreio',
    text: 'O site não usa cookies, ferramentas de análise nem anúncios.',
  },
  {
    icon: 'minimal',
    title: 'Só o necessário',
    text: 'Quando você fala com a gente, pedimos apenas o que precisamos para responder.',
  },
  {
    icon: 'rights',
    title: 'Seus dados, suas regras',
    text: 'Peça para ver, corrigir ou apagar seus dados quando quiser.',
  },
]

// ===============================================
// DADOS QUE USAMOS (os cards da seção 02)
// ===============================================
// soon: true = função que ainda vai existir no site (mostra "Em breve")
// keep: prazo (EXEMPLO: confira antes de publicar)
// basis: base legal na LGPD (VALIDAR com o orientador)

export const dataUses = [
  {
    name: 'Mensagens do Contact Us',
    data: 'Nome, e-mail, assunto escolhido e a mensagem.',
    purpose: 'Responder sua mensagem, pedido de suporte, proposta de parceria ou contato de imprensa.',
    keep: 'Até 1 ano depois da resposta.',
    basis: 'Interesse legítimo em responder a quem procura a equipe (art. 7º, IX).',
  },
  {
    name: 'Enviar um jogo',
    soon: true,
    data: 'Nome, e-mail, nome do estúdio e as informações do jogo que você enviar.',
    purpose: 'Avaliar a proposta e conversar sobre uma possível parceria.',
    keep: 'Até 1 ano depois da resposta à proposta.',
    basis: 'Conversas antes de uma parceria, feitas a seu pedido (art. 7º, V).',
  },
  {
    name: 'Logins do Painel',
    data: 'E-mail e senha da equipe e dos estúdios parceiros. A senha é guardada embaralhada (hash), nunca como texto.',
    purpose: 'Deixar só quem tem permissão publicar e editar jogos e posts.',
    keep: 'Enquanto o login existir. Quando ele é apagado, o e-mail sai junto.',
    basis: 'Execução da parceria com o estúdio (art. 7º, V).',
  },
  {
    name: 'Equipe e estúdios no site',
    data: 'Nome, apelido, cargo, foto, descrição e redes sociais de quem aparece na página About, nos posts e nas páginas dos estúdios.',
    purpose: 'Mostrar quem faz os jogos.',
    keep: 'Enquanto a pessoa fizer parte da equipe ou até ela pedir para sair do site.',
    basis: 'Autorização por escrito de cada pessoa (art. 7º, I).',
  },
  {
    name: 'Tentativas de login',
    data: 'Endereço IP de quem erra a senha do Painel.',
    purpose: 'Bloquear por um tempo quem tenta adivinhar senhas.',
    keep: '15 minutos, só na memória do servidor.',
    basis: 'Interesse legítimo em proteger o Painel (art. 7º, IX).',
  },
]

// ===============================================
// SEÇÕES DA PÁGINA
// ===============================================
// id:     âncora (o link do sumário leva para #id)
// title:  título da seção
// blocks: o conteúdo, na ordem
//   { type: 'p', text }          -> parágrafo
//   { type: 'list', items }      -> lista com marcadores
//   { type: 'data' }             -> os cards de "dataUses" (acima)
//   { type: 'note', text }       -> caixa de destaque

export const sections = [
  {
    id: 'quem-somos',
    title: 'Quem cuida dos seus dados',
    blocks: [
      {
        type: 'p',
        text: 'A Trevo Team é uma publisher de jogos indie: ajuda estúdios pequenos a divulgar e lançar seus jogos. Nos termos da LGPD, somos a controladora dos dados descritos nesta página, ou seja, quem decide como eles são usados.',
      },
      {
        type: 'p',
        text: 'Para qualquer assunto sobre privacidade, escreva para {email}. Quem responde é a pessoa da equipe encarregada da proteção de dados.',
      },
    ],
  },
  {
    id: 'dados',
    title: 'Que dados usamos e para quê',
    blocks: [
      {
        type: 'p',
        text: 'Visitar o site não exige cadastro. Os dados abaixo só existem quando você usa uma destas funções. Passado o prazo de cada um, ele é apagado.',
      },
      { type: 'data' },
    ],
  },
  {
    id: 'navegador',
    title: 'O que fica no seu navegador',
    blocks: [
      {
        type: 'p',
        text: 'O site não usa cookies. Duas informações ficam guardadas no seu próprio navegador e nunca são enviadas para a gente:',
      },
      {
        type: 'list',
        items: [
          'As escolhas do menu de acessibilidade (tema, tamanho do texto e as outras opções), para o site abrir do jeito que você prefere. Elas ficam até você limpar os dados do navegador ou usar o botão Voltar ao padrão do menu.',
          'O login do Painel, só para quem é da equipe ou de um estúdio parceiro. Ele some quando a aba é fechada e vale por, no máximo, oito horas.',
        ],
      },
      {
        type: 'p',
        text: 'Não usamos ferramentas de análise de visitas, anúncios nem botões de redes sociais que acompanham o que você faz.',
      },
    ],
  },
  {
    id: 'terceiros',
    title: 'Serviços de outras empresas',
    blocks: [
      {
        type: 'p',
        text: 'Para o site funcionar, algumas empresas recebem dados técnicos da sua visita, como o endereço IP e o tipo de navegador:',
      },
      {
        type: 'list',
        items: [
          'Hospedagem: o site fica na Vercel, e o servidor e o banco de dados, na Railway. Elas recebem os dados técnicos de cada acesso para entregar as páginas.',
          'Fonte mais legível: se você ligar essa opção no menu de acessibilidade, a fonte é baixada do Google Fonts, e o Google recebe o seu endereço IP. Com a opção desligada, nada é enviado ao Google.',
          'Links para fora: os links para lojas de jogos e redes sociais levam para sites que têm as próprias políticas de privacidade.',
        ],
      },
      {
        type: 'p',
        text: 'Quando o formulário do Contact Us começar a mandar e-mails, o serviço de envio usado também vai aparecer aqui.',
      },
    ],
  },
  {
    id: 'compartilhamento',
    title: 'Com quem compartilhamos',
    blocks: [
      {
        type: 'p',
        text: 'Não vendemos, não alugamos e não trocamos seus dados. Eles ficam com a equipe da Trevo Team e com os serviços da seção anterior. Uma proposta de jogo só é mostrada a quem da equipe vai avaliá-la.',
      },
      {
        type: 'p',
        text: 'Só passamos dados para outras pessoas se a lei obrigar, por exemplo, por ordem da Justiça.',
      },
    ],
  },
  {
    id: 'seguranca',
    title: 'Como protegemos',
    blocks: [
      {
        type: 'list',
        items: [
          'O site usa conexão segura (HTTPS).',
          'As senhas do Painel são guardadas embaralhadas (hash com scrypt), nunca como texto.',
          'O login do Painel vale por oito horas, e quem erra a senha muitas vezes espera 15 minutos para tentar de novo.',
          'Cada estúdio parceiro só vê e edita os próprios jogos e posts.',
        ],
      },
      {
        type: 'p',
        text: 'Nenhum sistema é totalmente seguro. Se algum problema puder trazer risco para você, avisamos você e a Autoridade Nacional de Proteção de Dados (ANPD).',
      },
    ],
  },
  {
    id: 'direitos',
    title: 'Seus direitos',
    blocks: [
      {
        type: 'p',
        text: 'A LGPD garante que você pode, a qualquer momento:',
      },
      {
        type: 'list',
        items: [
          'saber se usamos dados seus e ver quais são;',
          'corrigir dados errados, incompletos ou desatualizados;',
          'pedir que apaguemos dados desnecessários ou que você autorizou;',
          'retirar uma autorização que você tenha dado;',
          'saber com quem os dados foram compartilhados;',
          'levar seus dados para outro serviço (portabilidade).',
        ],
      },
      {
        type: 'note',
        text: 'Para pedir qualquer um deles, escreva para {email}. Respondemos em até 15 dias. Se não ficar satisfeito, você também pode reclamar na [ANPD](https://www.gov.br/anpd).',
      },
    ],
  },
  {
    id: 'menores',
    title: 'Crianças e adolescentes',
    blocks: [
      {
        type: 'p',
        text: 'Qualquer pessoa pode navegar pelo site. Para mandar uma mensagem ou enviar um jogo, menores de 12 anos precisam da autorização de um dos pais ou responsável. Se uma criança mandou dados sem essa autorização, fale com a gente que apagamos.',
      },
    ],
  },
  {
    id: 'mudancas',
    title: 'Mudanças nesta política',
    blocks: [
      {
        type: 'p',
        text: 'Quando o site ganhar funções novas, como a página Enviar um jogo, esta página vai mudar. A data da última mudança fica no topo. Se a mudança for grande, avisamos aqui no site.',
      },
    ],
  },
]