/**
 * SERVIÇO: validação
 * ==================
 * Funções pequenas para conferir os dados que chegam do painel.
 * Cada função devolve o valor limpo ou registra um erro na lista "errors".
 */

/** Texto: tira espaços das pontas e confere o tamanho. */
export function text(value, field, errors, { min = 0, max = 200, label = field } = {}) {
  const clean = typeof value === 'string' ? value.trim() : ''
  if (clean.length < min) errors[field] = min === 1 ? `${label} é obrigatório.` : `${label} precisa ter pelo menos ${min} caracteres.`
  else if (clean.length > max) errors[field] = `${label} pode ter no máximo ${max} caracteres.`
  return clean
}

/** Uma das opções permitidas. */
export function oneOf(value, options, field, errors, label = field) {
  if (!options.includes(value)) errors[field] = `${label} inválido.`
  return value
}

/** Número inteiro dentro de um intervalo. */
export function integer(value, field, errors, { min = 0, max = 9999, label = field } = {}) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < min || number > max) {
    errors[field] = `${label} precisa ser um número entre ${min} e ${max}.`
    return min
  }
  return number
}

/**
 * Caminho de imagem: vazio, uma imagem enviada pelo painel (/uploads/...)
 * ou um endereço https externo.
 */
export function image(value, field, errors) {
  const clean = typeof value === 'string' ? value.trim() : ''
  if (clean === '') return ''
  if (/^\/uploads\/[\w.-]+$/.test(clean) || /^https:\/\/[^\s"'<>]+$/.test(clean)) return clean
  errors[field] = 'Imagem inválida.'
  return ''
}

/** Link de rede social: https://..., http://... ou "#" (provisório). */
export function link(value, field, errors) {
  const clean = typeof value === 'string' ? value.trim() : ''
  if (clean === '#' || /^https?:\/\/[^\s"'<>]+$/.test(clean)) return clean
  errors[field] = 'Link inválido (use https://...).'
  return '#'
}

/** Lista com no máximo "max" itens. */
export function list(value, field, errors, max) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) {
    errors[field] = 'Formato inválido.'
    return []
  }
  if (value.length > max) errors[field] = `No máximo ${max} itens.`
  return value.slice(0, max)
}
