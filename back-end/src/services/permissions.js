/**
 * SERVIÇO: permissões
 * ===================
 * Regras de quem pode mexer em quê no painel. As rotas chamam estas funções
 * antes de ler ou gravar qualquer coisa.
 *
 *                         admin (Trevo)     studio (estúdio)
 *   Posts                 todos             só os do estúdio dele
 *   Jogos                 todos             só os do estúdio dele
 *   Desenvolvedoras       todas             só ver e editar a dele
 *   Criar/apagar estúdio  sim               não
 *   Logins dos estúdios   sim               não
 *
 * "Do estúdio dele" = o conteúdo tem developerId igual ao do login.
 * Quando um estúdio cria ou edita algo, o developerId é sempre o dele:
 * ele não consegue passar o conteúdo para outro estúdio.
 */

import { HttpError } from './errors.js'

/** O login é da equipe da Trevo? */
export function isAdmin(user) {
  return user?.role === 'admin'
}

/** Filtro das listas do painel: admin vê tudo; estúdio, só o que é dele. */
export function scopeFor(user) {
  return isAdmin(user) ? {} : { developerId: user.developerId }
}

/** O login pode mexer em um conteúdo que pertence a este estúdio? */
export function canManage(user, developerId) {
  if (isAdmin(user)) return true
  return Boolean(user?.developerId) && Number(developerId) === user.developerId
}

/** Igual ao canManage, mas para a requisição com 403 quando não pode. */
export function assertCanManage(user, developerId, message = 'Você só pode mexer no conteúdo do seu estúdio.') {
  if (!canManage(user, developerId)) throw new HttpError(403, message)
}

/**
 * Dono de um conteúdo novo ou editado:
 * - admin: o estúdio escolhido no formulário (ou nenhum);
 * - estúdio: sempre o dele, não importa o que veio no formulário.
 */
export function ownerFor(user, requestedDeveloperId) {
  return isAdmin(user) ? requestedDeveloperId : user.developerId
}
