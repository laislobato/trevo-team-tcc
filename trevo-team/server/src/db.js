/**
 * ARQUIVO: db.js
 * ==============
 * Abre o banco SQLite (um arquivo só) e cria as tabelas se ainda não existirem.
 * Usa o SQLite que já vem no Node (node:sqlite), sem instalar nada.
 *
 * Tabelas:
 * - users       -> login da equipe (só existe uma conta)
 * - developers  -> estúdios exibidos em "Developed By"
 * - posts       -> posts do blog
 */

import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { hashPassword } from './services/passwords.js'
import { EXAMPLE_DEVELOPERS, EXAMPLE_POSTS } from './seed.js'

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

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
`

/** Abre (ou cria) o banco. Use ':memory:' nos testes. */
export function openDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON;')
  if (path !== ':memory:') db.exec('PRAGMA journal_mode = WAL;')
  db.exec(SCHEMA)
  return db
}

/** Cria a conta da equipe na primeira vez (se ainda não existir nenhuma). */
export function ensureAdmin(db, email, password) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM users').get()
  if (total > 0) return false
  if (!email || !password) {
    console.warn('⚠️  Nenhuma conta criada: preencha ADMIN_EMAIL e ADMIN_PASSWORD no .env.')
    return false
  }
  db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hashPassword(password))
  return true
}

/** Coloca os posts e desenvolvedoras de exemplo (fictícios) num banco vazio. */
export function seedExamples(db) {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM posts').get()
  if (total > 0) return false

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
  return true
}
