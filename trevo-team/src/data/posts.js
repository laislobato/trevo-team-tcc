/**
 * DADOS: tipos de post
 * ====================
 * Os posts agora vêm do backend (pasta server/), criados pelo painel.
 * Aqui ficam só os tipos de post e os templates usados no editor.
 *
 * - id:    valor guardado no banco
 * - label: nome da etiqueta no site
 * - tab:   nome da aba do blog
 */

export const POST_TYPES = {
  anuncio: 'World Premiere',
  patch: 'Patch Notes',
  aviso: 'Aviso',
}

export const POST_TYPE_OPTIONS = [
  { id: 'anuncio', label: 'World Premiere (anúncio)', tab: 'Anúncios' },
  { id: 'patch', label: 'Patch Notes', tab: 'Patch Notes' },
  { id: 'aviso', label: 'Aviso', tab: 'Avisos' },
]

/**
 * Templates de mensagem por tipo: preenchem o subtítulo e o texto
 * de um post novo, para a equipe só completar os trechos entre [ ].
 */
export const POST_TEMPLATES = {
  anuncio: {
    subtitle: '[Uma frase que apresente o jogo]',
    body:
      '[Nome do jogo] é [gênero] da [desenvolvedora], com lançamento previsto para [data] em [plataformas].\n\n' +
      '[Conte a história ou a proposta do jogo em poucas frases.]\n\n' +
      '[Diga onde acompanhar: campanha de financiamento, lista de desejos ou redes sociais.]',
  },
  patch: {
    subtitle: 'O que mudou na versão [número]',
    body:
      'Novidades: [liste o que foi adicionado].\n\n' +
      'Ajustes: [liste o que mudou no jogo].\n\n' +
      'Correções: [liste os problemas resolvidos].',
  },
  aviso: {
    subtitle: '[Resumo do aviso em uma frase]',
    body:
      '[O que vai acontecer e quando.]\n\n' +
      '[O que muda para os jogadores durante esse período.]\n\n' +
      '[Onde pedir ajuda: página Contact Us, assunto "Suporte".]',
  },
}
