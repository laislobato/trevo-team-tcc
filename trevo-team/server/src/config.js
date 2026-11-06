/**
 * ARQUIVO: config.js
 * ==================
 * Lê as configurações do arquivo .env (ou das variáveis da hospedagem)
 * e confere se o que é obrigatório está preenchido.
 */

const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 3001,

  // Endereços do front que podem chamar a API (separados por vírgula)
  frontUrls: (process.env.FRONT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),

  tokenSecret: process.env.TOKEN_SECRET || '',
  tokenHours: 8, // tempo que o login dura

  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',

  dbPath: process.env.DB_PATH || './data/trevo.db',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  seedExamples: process.env.SEED_EXAMPLES !== 'false',

  maxUploadMb: 5,
}

/**
 * Para o servidor com uma mensagem clara se faltar algo importante.
 * Assim ninguém publica o site com senha ou chave fracas por engano.
 */
export function checkConfig() {
  const problems = []
  const [major, minor] = process.versions.node.split('.').map(Number)
  if (major < 22 || (major === 22 && minor < 13)) {
    problems.push(`Node ${process.versions.node} é antigo: instale o Node 22.13 ou mais novo (ou o 24).`)
  }
  if (config.tokenSecret.length < 32 || config.tokenSecret.startsWith('troque')) {
    problems.push('TOKEN_SECRET precisa ter pelo menos 32 caracteres aleatórios (veja o .env.example).')
  }
  if (isProduction && config.adminPassword.startsWith('troque')) {
    problems.push('ADMIN_PASSWORD ainda está com o valor de exemplo.')
  }
  if (problems.length) {
    console.error('\n❌ Configuração incompleta:\n- ' + problems.join('\n- ') + '\n')
    process.exit(1)
  }
}
