/**
 * ARQUIVO: db.js
 * ==============
 * Abre o banco SQLite (um arquivo só) e cria as tabelas se ainda não existirem.
 * Usa o SQLite que já vem no Node (node:sqlite), sem instalar nada.
 *
 * Tabelas:
 * - users       -> logins do painel
 *                  role 'admin'  = equipe da Trevo (mexe em tudo)
 *                  role 'studio' = um estúdio (developer_id diz qual; só mexe no que é dele)
 * - developers  -> estúdios exibidos em "Developed By"
 * - posts       -> posts do blog (developer_id = estúdio dono do post)
 * - games       -> jogos (developer_id = estúdio dono do jogo)
 * - meta        -> anotações internas (ex.: se os exemplos já foram criados)
 *
 * Bancos criados antes dos logins de estúdio são atualizados sozinhos
 * (ver migrate): a conta que já existia vira 'admin' e nada se perde.
 */

import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { hashPassword } from './services/passwords.js'
import { EXAMPLE_DEVELOPERS, EXAMPLE_POSTS, EXAMPLE_GAMES } from './seed.js'

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS developers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    logo        TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    active_devs INTEGER NOT NULL DEFAULT 0,
    socials     TEXT NOT NULL DEFAULT '[]',  -- lista JSON [{ label, url }]
    members     TEXT NOT NULL DEFAULT '[]',  -- lista JSON [{ name, role, photo }]
    created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    slug         TEXT NOT NULL UNIQUE,
    type         TEXT NOT NULL CHECK (type IN ('anuncio', 'patch', 'aviso')),
    title        TEXT NOT NULL,
    excerpt      TEXT NOT NULL DEFAULT '',
    subtitle     TEXT NOT NULL DEFAULT '',
    body         TEXT NOT NULL DEFAULT '',   -- parágrafos separados por linha em branco
    cover        TEXT NOT NULL DEFAULT '',
    gallery      TEXT NOT NULL DEFAULT '[]', -- lista JSON com até 3 imagens
    author_name  TEXT NOT NULL DEFAULT '',
    author_photo TEXT NOT NULL DEFAULT '',
    developer_id INTEGER REFERENCES developers(id) ON DELETE SET NULL,
    status       TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    published_at TEXT,                       -- data de publicação (UTC); no futuro = agendado
    created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS posts_published ON posts (status, published_at);

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'studio')),
    -- estúdio do login; apagar o estúdio apaga os logins dele junto
    developer_id  INTEGER REFERENCES developers(id) ON DELETE CASCADE,
    created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS games (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    slug            TEXT NOT NULL UNIQUE,        -- endereço: /jogo/<slug>
    title           TEXT NOT NULL,
    subtitle        TEXT NOT NULL DEFAULT '',
    developer_id    INTEGER REFERENCES developers(id) ON DELETE SET NULL,
    -- vitrine e banner da página /jogo
    character       TEXT NOT NULL DEFAULT '',    -- personagem da vitrine
    character_image TEXT NOT NULL DEFAULT '',
    color           TEXT NOT NULL DEFAULT 'green' CHECK (color IN ('green', 'cyan', 'orange')),
    banner          TEXT NOT NULL DEFAULT '',    -- imagem do banner no topo da página /jogo
    description     TEXT NOT NULL DEFAULT '',    -- texto curto (vitrine e topo da página do jogo)
    -- quadro de informações
    genre           TEXT NOT NULL DEFAULT '',
    rating          TEXT NOT NULL DEFAULT 'Livre', -- classificação indicativa
    theme           TEXT NOT NULL DEFAULT '',
    platforms       TEXT NOT NULL DEFAULT '[]',  -- lista JSON ["PC", "Xbox", ...]
    -- resto da página do jogo
    quote           TEXT NOT NULL DEFAULT '',
    screenshots     TEXT NOT NULL DEFAULT '[]',  -- lista JSON com até 3 imagens
    about           TEXT NOT NULL DEFAULT '',
    characters      TEXT NOT NULL DEFAULT '[]',  -- lista JSON [{ name, text, image }]
    status          TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS games_developer ON games (developer_id);

  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`

/**
 * Atualiza bancos antigos sem apagar nada.
 * Cada passo confere se a mudança já foi feita antes de fazer.
 */
function migrate(db) {
  const userColumns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name)

  // 1) Logins de estúdio: colunas "role" e "developer_id" na tabela users
  if (!userColumns.includes('role')) {
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'studio'))`)
  }
  if (!userColumns.includes('developer_id')) {
    db.exec('ALTER TABLE users ADD COLUMN developer_id INTEGER REFERENCES developers(id) ON DELETE CASCADE')
  }

  db.exec('CREATE INDEX IF NOT EXISTS users_developer ON users (developer_id)')
  db.exec('CREATE INDEX IF NOT EXISTS posts_developer ON posts (developer_id)')
}

/** Abre (ou cria) o banco. Use ':memory:' nos testes. */
export function openDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON;')
  if (path !== ':memory:') db.exec('PRAGMA journal_mode = WAL;')
  db.exec(SCHEMA)
  migrate(db)
  return db
}

/** Cria a conta de admin da Trevo na primeira vez (se ainda não existir nenhum admin). */
export function ensureAdmin(db, email, password) {
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM users WHERE role = 'admin'`).get()
  if (total > 0) return false
  if (!email || !password) {
    console.warn('⚠️  Nenhuma conta criada: preencha ADMIN_EMAIL e ADMIN_PASSWORD no .env.')
    return false
  }
  db.prepare(`INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')`).run(email, hashPassword(password))
  return true
}

// ===============================================
// EXEMPLOS
// ===============================================

const getMeta = (db, key) => db.prepare('SELECT value FROM meta WHERE key = ?').get(key)?.value
const setMeta = (db, key, value) =>
  db.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').run(key, value)
const count = (db, table) => db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get().total

/**
 * Coloca o conteúdo de exemplo (fictício) no banco, UMA vez só:
 * - posts e desenvolvedoras: se ainda não houver nenhum post;
 * - jogos: se ainda não houver nenhum jogo (bancos antigos ganham os 3 jogos
 *   que antes ficavam fixos no site).
 * Cada parte é anotada na tabela "meta". Assim, se a equipe apagar todos os
 * exemplos pelo painel, eles não voltam quando o servidor reinicia.
 * Devolve true se criou alguma coisa.
 */
export function seedExamples(db) {
  let created = false

  if (!getMeta(db, 'seed_posts')) {
    if (count(db, 'posts') === 0) {
      seedPosts(db)
      created = true
    }
    setMeta(db, 'seed_posts', 'ok')
  }

  if (!getMeta(db, 'seed_games')) {
    if (count(db, 'games') === 0) {
      seedGames(db)
      created = true
    }
    setMeta(db, 'seed_games', 'ok')
  }

  return created
}

function seedPosts(db) {
  const insertDev = db.prepare(`
    INSERT INTO developers (name, description, active_devs, socials, members)
    VALUES (:name, :description, :activeDevs, :socials, :members)`)
  const devIds = {}
  for (const dev of EXAMPLE_DEVELOPERS) {
    const { lastInsertRowid } = insertDev.run({
      name: dev.name,
      description: dev.description,
      activeDevs: dev.activeDevs,
      socials: JSON.stringify(dev.socials),
      members: JSON.stringify(dev.members),
    })
    devIds[dev.key] = Number(lastInsertRowid)
  }

  const insertPost = db.prepare(`
    INSERT INTO posts (slug, type, title, excerpt, subtitle, body, author_name, developer_id, status, published_at)
    VALUES (:slug, :type, :title, :excerpt, :subtitle, :body, :authorName, :developerId, 'publicado', :publishedAt)`)
  for (const { developerKey, ...post } of EXAMPLE_POSTS) {
    insertPost.run({ ...post, developerId: devIds[developerKey] })
  }
}

/** Jogos de exemplo, ligados às desenvolvedoras de exemplo pelo nome (se existirem) */
function seedGames(db) {
  const findDev = db.prepare('SELECT id FROM developers WHERE name = ?')
  const insertGame = db.prepare(`
    INSERT INTO games (slug, title, subtitle, developer_id, character, color, description, genre, rating,
      theme, platforms, quote, screenshots, about, characters, status)
    VALUES (:slug, :title, :subtitle, :developerId, :character, :color, :description, :genre, :rating,
      :theme, :platforms, :quote, '[]', :about, :characters, 'publicado')`)
  for (const { developerName, platforms, characters, ...game } of EXAMPLE_GAMES) {
    insertGame.run({
      ...game,
      developerId: findDev.get(developerName)?.id ?? null,
      platforms: JSON.stringify(platforms),
      characters: JSON.stringify(characters),
    })
  }
}
