/**
 * SERVIÇO: tokens de login
 * ========================
 * Depois do login, o servidor entrega um token (no formato JWT, assinado com
 * HMAC-SHA256). O painel manda esse token em cada pedido de administração:
 *
 *   Authorization: Bearer <token>
 *
 * O token tem 3 partes separadas por ponto: cabeçalho.dados.assinatura
 * Se alguém alterar os dados, a assinatura não confere e o token é recusado.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'

const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
const sign = (text, secret) => createHmac('sha256', secret).update(text).digest('base64url')

export function createToken(data, secret, hours) {
  const now = Math.floor(Date.now() / 1000)
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const payload = encode({ ...data, iat: now, exp: now + hours * 3600 })
  return `${header}.${payload}.${sign(`${header}.${payload}`, secret)}`
}

/** Devolve os dados do token, ou null se ele for inválido ou estiver vencido. */
export function verifyToken(token, secret) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) return null
  const [header, payload, signature] = parts

  const expected = Buffer.from(sign(`${header}.${payload}`, secret))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}
