/**
 * ARQUIVO: index.js
 * =================
 * Ponto de entrada do backend:
 * 1. confere a configuração (.env)
 * 2. abre o banco e cria a conta da equipe (na primeira vez)
 * 3. coloca os exemplos, se o banco estiver vazio
 * 4. liga o servidor
 *
 * Rodar:  npm run dev   (reinicia sozinho quando um arquivo muda)
 *         npm start     (na hospedagem)
 */

import { config, checkConfig } from './config.js'
import { openDatabase, ensureAdmin, seedExamples } from './db.js'
import { createApp } from './app.js'

checkConfig()

const db = openDatabase(config.dbPath)

if (ensureAdmin(db, config.adminEmail, config.adminPassword)) {
  console.log(`👤 Conta da equipe criada: ${config.adminEmail}`)
}
if (config.seedExamples && seedExamples(db)) {
  console.log('🌱 Posts e desenvolvedoras de exemplo criados.')
}

const app = createApp({ db, config })

app.listen(config.port, () => {
  console.log(`✅ API da Trevo Team rodando em http://localhost:${config.port}`)
})
