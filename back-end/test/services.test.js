/**
 * TESTES AUTOMÁTICOS DO BACKEND
 * =============================
 * Rodar:  npm test
 *
 * Usam um banco na memória (não mexem no banco de verdade) e conferem
 * senha, token, limite de tentativas, posts, desenvolvedoras, logins dos
 * estúdios e permissões.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { openDatabase, ensureAdmin, seedExamples } from '../src/db.js'
import { hashPassword, verifyPassword } from '../src/services/passwords.js'
import { createToken, verifyToken } from '../src/services/tokens.js'
import { createLimiter } from '../src/services/rateLimit.js'
import * as users from '../src/services/users.js'
import { checkLogin, changePassword } from '../src/services/users.js'
import { isAdmin, canManage, scopeFor, ownerFor, assertCanManage } from '../src/services/permissions.js'
import * as posts from '../src/services/posts.js'
import * as devs from '../src/services/developers.js'
import * as games from '../src/services/games.js'
import * as banners from '../src/services/banners.js'

const SECRET = 'segredo-de-teste-com-mais-de-32-caracteres!!'

function freshDb() {
  const db = openDatabase(':memory:')
  ensureAdmin(db, 'equipe@trevo.com', 'senha-forte-123')
  return db
}

const validPost = (extra = {}) => ({
  type: 'anuncio',
  title: 'Novo jogo anunciado',
  excerpt: 'Resumo',
  subtitle: 'Sub',
  body: 'Parágrafo 1\n\nParágrafo 2',
  status: 'publicado',
  ...extra,
})

// ------------------------------------------------------------------
test('senha: hash confere com a senha certa e recusa a errada', () => {
  const stored = hashPassword('minha-senha')
  assert.match(stored, /^scrypt\$[0-9a-f]+\$[0-9a-f]+$/)
  assert.equal(verifyPassword('minha-senha', stored), true)
  assert.equal(verifyPassword('outra', stored), false)
  assert.notEqual(hashPassword('minha-senha'), stored, 'cada hash tem um sal diferente')
})

test('token: válido, alterado, com outra chave e vencido', () => {
  const token = createToken({ sub: 1 }, SECRET, 1)
  assert.equal(verifyToken(token, SECRET).sub, 1)

  const [h, p, s] = token.split('.')
  const fakePayload = Buffer.from(JSON.stringify({ sub: 99, exp: 9999999999 })).toString('base64url')
  assert.equal(verifyToken(`${h}.${fakePayload}.${s}`, SECRET), null, 'dados alterados')
  assert.equal(verifyToken(token, SECRET + 'x'), null, 'outra chave')
  assert.equal(verifyToken(createToken({ sub: 1 }, SECRET, -1), SECRET), null, 'vencido')
  assert.equal(verifyToken('lixo', SECRET), null)
})

test('limite de tentativas bloqueia depois de 5 erros e zera no acerto', () => {
  const limiter = createLimiter({ max: 5, windowMs: 60_000 })
  for (let i = 0; i < 5; i += 1) {
    assert.equal(limiter.isAllowed('ip'), true)
    limiter.fail('ip')
  }
  assert.equal(limiter.isAllowed('ip'), false)
  assert.equal(limiter.isAllowed('outro-ip'), true)
  limiter.reset('ip')
  assert.equal(limiter.isAllowed('ip'), true)
})

test('login da equipe e troca de senha', () => {
  const db = freshDb()
  assert.equal(ensureAdmin(db, 'outro@x.com', 'abc'), false, 'só cria a conta uma vez')
  assert.deepEqual(checkLogin(db, ' EQUIPE@trevo.com ', 'senha-forte-123'), {
    id: 1,
    email: 'equipe@trevo.com',
    role: 'admin',
    developerId: null,
    developer: null,
  })
  assert.equal(checkLogin(db, 'equipe@trevo.com', 'errada'), null)
  assert.equal(checkLogin(db, 'ninguem@trevo.com', 'senha-forte-123'), null)

  assert.throws(() => changePassword(db, 1, 'errada', 'nova-senha-123'), /senha atual/)
  assert.throws(() => changePassword(db, 1, 'senha-forte-123', 'curta'), /10 caracteres/)
  changePassword(db, 1, 'senha-forte-123', 'nova-senha-123')
  assert.ok(checkLogin(db, 'equipe@trevo.com', 'nova-senha-123'))
})

test('exemplos: 4 posts e 2 desenvolvedoras, só uma vez', () => {
  const db = freshDb()
  assert.equal(seedExamples(db), true)
  assert.equal(seedExamples(db), false)
  assert.equal(posts.listPublicPosts(db).length, 4)
  assert.equal(devs.listDevelopers(db).length, 3, 'Trevo Team + 2 exemplos')
  assert.equal(posts.listPublicPosts(db, 'patch').length, 1)
  assert.throws(() => posts.listPublicPosts(db, 'invalido'), /Tipo/)
})

test('slug sem acentos e único', () => {
  assert.equal(posts.slugify('Raízes de Vidro: Patch 1.2!'), 'raizes-de-vidro-patch-1-2')
  const db = freshDb()
  const a = posts.createPost(db, validPost({ title: 'Mesmo título' }))
  const b = posts.createPost(db, validPost({ title: 'Mesmo título' }))
  assert.equal(a.slug, 'mesmo-titulo')
  assert.equal(b.slug, 'mesmo-titulo-2')
})

test('rascunho e agendado não aparecem no site; publicado aparece', () => {
  const db = freshDb()
  posts.createPost(db, validPost({ title: 'Rascunho aqui', status: 'rascunho' }))
  posts.createPost(db, validPost({ title: 'Agendado aqui', publishedAt: '2999-01-01T12:00:00Z' }))
  const pub = posts.createPost(db, validPost({ title: 'Publicado agora' }))

  const visible = posts.listPublicPosts(db).map((p) => p.title)
  assert.deepEqual(visible, ['Publicado agora'])
  assert.equal(posts.listAllPosts(db).length, 3, 'o painel vê todos')
  assert.ok(pub.publishedAt.endsWith('Z'))
  assert.throws(() => posts.getPublicPost(db, 'rascunho-aqui'), /não encontrado/)
})

test('post público traz anterior e próximo', () => {
  const db = freshDb()
  seedExamples(db)
  const { post, previous, next } = posts.getPublicPost(db, 'lumen-drift-patch-1-2')
  assert.equal(post.developer.name, 'Coletivo Lume')
  assert.equal(previous.slug, 'raizes-de-vidro-data-de-lancamento') // mais antigo
  assert.equal(next.slug, 'manutencao-servidores-outubro') // mais novo
  const newest = posts.getPublicPost(db, 'mare-alta-world-premiere')
  assert.equal(newest.next, null)
})

test('validação recusa dados ruins', () => {
  const db = freshDb()
  const errorsOf = (input) => {
    try {
      posts.createPost(db, input)
      return {}
    } catch (e) {
      assert.equal(e.status, 400)
      return e.details
    }
  }
  assert.ok(errorsOf(validPost({ title: 'a' })).title)
  assert.ok(errorsOf(validPost({ type: 'outro' })).type)
  assert.ok(errorsOf(validPost({ status: 'x' })).status)
  assert.ok(errorsOf(validPost({ cover: 'javascript:alert(1)' })).cover)
  assert.ok(errorsOf(validPost({ cover: '/uploads/../senha' })).cover)
  assert.ok(errorsOf(validPost({ developerId: 999 })).developerId)
  assert.ok(errorsOf(validPost({ gallery: ['', '', '', ''] })).gallery)
  assert.ok(errorsOf(validPost({ publishedAt: 'ontem' })).publishedAt)
  assert.deepEqual(errorsOf(validPost({ cover: '/uploads/abc-123.webp' })), {})
})

test('editar mantém o slug e a data; apagar some', () => {
  const db = freshDb()
  const post = posts.createPost(db, validPost())
  const edited = posts.updatePost(db, post.id, validPost({ title: 'Título novo' }))
  assert.equal(edited.slug, post.slug)
  assert.equal(edited.publishedAt, post.publishedAt)
  posts.deletePost(db, post.id)
  assert.equal(posts.getPost(db, post.id), null)
  assert.throws(() => posts.deletePost(db, post.id), /não encontrado/)
})

test('desenvolvedora: criar, validar, editar e apagar sem perder os posts', () => {
  const db = freshDb()
  const dev = devs.createDeveloper(db, {
    name: 'Estúdio Teste',
    activeDevs: 2,
    socials: [{ label: 'Instagram', url: 'https://instagram.com/teste' }],
    members: [{ name: 'Ana', role: 'Arte', photo: '' }],
  })
  assert.equal(dev.members[0].name, 'Ana')
  assert.throws(() => devs.createDeveloper(db, { name: 'X' }), /Confira/)
  assert.throws(() => devs.createDeveloper(db, { name: 'Ok ok', socials: [{ label: 'a', url: 'javascript:x' }] }), /Confira/)

  const post = posts.createPost(db, validPost({ developerId: dev.id }))
  assert.equal(post.developer.name, 'Estúdio Teste')
  assert.equal(devs.updateDeveloper(db, dev.id, { name: 'Estúdio Novo' }).name, 'Estúdio Novo')

  devs.deleteDeveloper(db, dev.id)
  const after = posts.getPost(db, post.id)
  assert.equal(after.developer, null, 'o post continua, sem desenvolvedora')
})

// ------------------------------------------------------------------
// LOGINS DOS ESTÚDIOS E PERMISSÕES
// ------------------------------------------------------------------

/** Banco com o admin, um estúdio "Orvalho" e um estúdio "Lume", cada um com login */
function studioDb() {
  const db = freshDb()
  const orvalho = devs.createDeveloper(db, { name: 'Estúdio Orvalho' })
  const lume = devs.createDeveloper(db, { name: 'Coletivo Lume' })
  users.createStudioAccount(db, { email: 'orvalho@teste.com', password: 'senha-do-orvalho', developerId: orvalho.id })
  users.createStudioAccount(db, { email: 'lume@teste.com', password: 'senha-do-lume-1', developerId: lume.id })
  return {
    db,
    orvalho,
    lume,
    admin: checkLogin(db, 'equipe@trevo.com', 'senha-forte-123'),
    orvalhoUser: checkLogin(db, 'orvalho@teste.com', 'senha-do-orvalho'),
    lumeUser: checkLogin(db, 'lume@teste.com', 'senha-do-lume-1'),
  }
}

test('banco antigo (sem tipo de login) é atualizado e a conta vira admin', () => {
  const dir = mkdtempSync(join(tmpdir(), 'trevo-'))
  const path = join(dir, 'antigo.db')
  // Cria um banco no formato antigo, como o que já está na hospedagem
  const old = new DatabaseSync(path)
  old.exec(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
  old.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run('equipe@trevo.com', hashPassword('senha-forte-123'))
  old.close()

  const db = openDatabase(path)
  const user = checkLogin(db, 'equipe@trevo.com', 'senha-forte-123')
  assert.equal(user.role, 'admin', 'a conta antiga continua entrando e é admin')
  assert.equal(ensureAdmin(db, 'outro@x.com', 'outra-senha-123'), false, 'não cria outro admin')
  db.close()
  openDatabase(path).close() // abrir de novo não quebra (a atualização só roda uma vez)
  rmSync(dir, { recursive: true, force: true })
})

test('login de estúdio: criar, entrar, validar, editar e apagar', () => {
  const { db, orvalho, orvalhoUser } = studioDb()
  assert.equal(orvalhoUser.role, 'studio')
  assert.equal(orvalhoUser.developerId, orvalho.id)
  assert.deepEqual(orvalhoUser.developer, { id: orvalho.id, name: 'Estúdio Orvalho' })
  assert.equal(users.listStudioAccounts(db).length, 2)
  assert.equal(users.listStudioAccounts(db, orvalho.id).length, 1)

  const errorsOf = (input) => {
    try {
      users.createStudioAccount(db, input)
      return {}
    } catch (e) {
      assert.equal(e.status, 400)
      return e.details
    }
  }
  assert.ok(errorsOf({ email: 'orvalho@teste.com', password: 'senha-longa-123', developerId: orvalho.id }).email, 'e-mail repetido')
  assert.ok(errorsOf({ email: 'EQUIPE@trevo.com', password: 'senha-longa-123', developerId: orvalho.id }).email, 'e-mail do admin')
  assert.ok(errorsOf({ email: 'sem-arroba', password: 'senha-longa-123', developerId: orvalho.id }).email)
  assert.ok(errorsOf({ email: 'novo@teste.com', password: 'curta', developerId: orvalho.id }).password)
  assert.ok(errorsOf({ email: 'novo@teste.com', password: 'senha-longa-123', developerId: 999 }).developerId)

  // Editar: senha vazia mantém a senha; senha preenchida troca
  users.updateStudioAccount(db, orvalhoUser.id, { email: 'contato@orvalho.com', password: '' })
  assert.ok(checkLogin(db, 'contato@orvalho.com', 'senha-do-orvalho'))
  users.updateStudioAccount(db, orvalhoUser.id, { email: 'contato@orvalho.com', password: 'senha-nova-orvalho' })
  assert.equal(checkLogin(db, 'contato@orvalho.com', 'senha-do-orvalho'), null)
  assert.ok(checkLogin(db, 'contato@orvalho.com', 'senha-nova-orvalho'))

  // As rotas de logins de estúdio não mexem na conta de admin
  assert.throws(() => users.updateStudioAccount(db, 1, { email: 'x@x.com' }), /não encontrado/)
  assert.throws(() => users.deleteStudioAccount(db, 1), /não encontrado/)

  users.deleteStudioAccount(db, orvalhoUser.id)
  assert.equal(checkLogin(db, 'contato@orvalho.com', 'senha-nova-orvalho'), null)
  assert.equal(users.getUser(db, orvalhoUser.id), null, 'login apagado perde o acesso na hora')
})

test('apagar a desenvolvedora apaga os logins dela', () => {
  const { db, lume, lumeUser } = studioDb()
  devs.deleteDeveloper(db, lume.id)
  assert.equal(users.getUser(db, lumeUser.id), null)
  assert.equal(users.listStudioAccounts(db).length, 1)
})

test('permissões: admin mexe em tudo; estúdio só no que é dele', () => {
  const { orvalho, lume, admin, orvalhoUser } = studioDb()
  assert.equal(isAdmin(admin), true)
  assert.equal(isAdmin(orvalhoUser), false)

  assert.equal(canManage(admin, lume.id), true)
  assert.equal(canManage(admin, null), true)
  assert.equal(canManage(orvalhoUser, orvalho.id), true)
  assert.equal(canManage(orvalhoUser, String(orvalho.id)), true, 'id vindo do endereço (texto)')
  assert.equal(canManage(orvalhoUser, lume.id), false)
  assert.equal(canManage(orvalhoUser, null), false, 'post sem estúdio é só do admin')
  assert.throws(() => assertCanManage(orvalhoUser, lume.id), (e) => e.status === 403)

  assert.deepEqual(scopeFor(admin), {})
  assert.deepEqual(scopeFor(orvalhoUser), { developerId: orvalho.id })
  assert.equal(ownerFor(admin, lume.id), lume.id, 'admin escolhe o estúdio')
  assert.equal(ownerFor(orvalhoUser, lume.id), orvalho.id, 'estúdio não passa o post para outro')
})

test('painel do estúdio lista só os posts dele', () => {
  const { db, orvalho, lume, orvalhoUser } = studioDb()
  posts.createPost(db, validPost({ title: 'Post do Orvalho', developerId: orvalho.id }))
  posts.createPost(db, validPost({ title: 'Post do Lume', developerId: lume.id }))
  posts.createPost(db, validPost({ title: 'Post da Trevo' }))
  assert.equal(posts.listAllPosts(db).length, 3)
  assert.deepEqual(posts.listAllPosts(db, scopeFor(orvalhoUser)).map((p) => p.title), ['Post do Orvalho'])
})

// ------------------------------------------------------------------
// JOGOS
// ------------------------------------------------------------------

const validGame = (extra = {}) => ({
  title: 'Jogo de Teste',
  subtitle: 'Sub',
  character: 'Herói',
  color: 'orange',
  description: 'Descrição curta',
  genre: 'Aventura',
  rating: '12 anos',
  theme: 'Fantasia',
  platforms: ['PC', 'Xbox'],
  quote: 'Uma frase',
  art: '/uploads/arte.png',
  screenshots: ['', '/uploads/abc.webp', ''],
  about: 'Sobre o jogo',
  characters: [{ name: 'HERÓI', text: 'O herói', image: '' }],
  status: 'publicado',
  ...extra,
})

test('exemplos: 3 jogos ligados às desenvolvedoras, só uma vez', () => {
  const db = freshDb()
  seedExamples(db)
  const list = games.listPublicGames(db)
  assert.deepEqual(list.map((g) => g.slug), ['raizes-de-vidro', 'mare-alta', 'lumen-drift'])
  assert.equal(list[0].developer.name, 'Estúdio Orvalho')
  assert.equal(list[2].developer.name, 'Coletivo Lume')
  assert.deepEqual(list[2].platforms, ['PC', 'Xbox', 'PlayStation'])
  assert.equal(list[0].characters.length, 3)

  // apagou todos os exemplos: eles não voltam quando o servidor reinicia
  for (const g of list) games.deleteGame(db, g.id)
  assert.equal(seedExamples(db), false)
  assert.equal(games.listAllGames(db).length, 0)
})

test('banco antigo com posts ganha os jogos de exemplo, sem repetir os posts', () => {
  const db = freshDb()
  devs.createDeveloper(db, { name: 'Estúdio Orvalho' })
  posts.createPost(db, validPost())
  assert.equal(seedExamples(db), true, 'criou os jogos')
  assert.equal(posts.listAllPosts(db).length, 1, 'não colocou os posts de exemplo')
  assert.equal(games.listAllGames(db).length, 3)
  assert.equal(games.getPublicGame(db, 'raizes-de-vidro').game.developer.name, 'Estúdio Orvalho')
  assert.equal(games.getPublicGame(db, 'lumen-drift').game.developer, null, 'Coletivo Lume não existe nesse banco')
})

test('jogo: criar, slug, rascunho fora do site e outros projetos', () => {
  const db = freshDb()
  const a = games.createGame(db, validGame({ title: 'Raízes de Vidro' }))
  const b = games.createGame(db, validGame({ title: 'Raízes de Vidro' }))
  games.createGame(db, validGame({ title: 'Rascunho secreto', status: 'rascunho' }))
  assert.equal(a.slug, 'raizes-de-vidro')
  assert.equal(b.slug, 'raizes-de-vidro-2')
  assert.equal(a.rating, '12 anos')
  assert.deepEqual(a.screenshots, ['', '/uploads/abc.webp', ''])

  assert.equal(games.listPublicGames(db).length, 2, 'rascunho não aparece no site')
  assert.equal(games.listAllGames(db).length, 3, 'o painel vê todos')
  assert.throws(() => games.getPublicGame(db, 'rascunho-secreto'), /não encontrado/)

  const { game, others } = games.getPublicGame(db, 'raizes-de-vidro')
  assert.equal(game.id, a.id)
  assert.deepEqual(others.map((o) => o.slug), ['raizes-de-vidro-2'])
})

test('jogo: validação recusa dados ruins', () => {
  const db = freshDb()
  const errorsOf = (input) => {
    try {
      games.createGame(db, input)
      return {}
    } catch (e) {
      assert.equal(e.status, 400)
      return e.details
    }
  }
  assert.ok(errorsOf(validGame({ title: 'a' })).title)
  assert.ok(errorsOf(validGame({ color: 'roxo' })).color)
  assert.ok(errorsOf(validGame({ rating: '13 anos' })).rating)
  assert.ok(errorsOf(validGame({ status: 'x' })).status)
  assert.ok(errorsOf(validGame({ platforms: ['PC', 'Atari'] }))['platforms.1'])
  assert.ok(errorsOf(validGame({ screenshots: ['', '', '', ''] })).screenshots)
  assert.ok(errorsOf(validGame({ art: '/uploads/../x' })).art)
  assert.ok(errorsOf(validGame({ characters: [{ name: '', text: 'x' }] }))['characters.0.name'])
  assert.ok(errorsOf(validGame({ description: 'x'.repeat(301) })).description)
  assert.ok(errorsOf(validGame({ developerId: 999 })).developerId)
  assert.deepEqual(errorsOf(validGame()), {})
  assert.deepEqual(games.createGame(db, validGame({ platforms: ['PC', 'PC'] })).platforms, ['PC'], 'sem repetir')
})

test('jogo: editar mantém o slug; apagar some; apagar o estúdio deixa o jogo sem estúdio', () => {
  const db = freshDb()
  const dev = devs.createDeveloper(db, { name: 'Estúdio Teste' })
  const game = games.createGame(db, validGame({ developerId: dev.id }))
  const edited = games.updateGame(db, game.id, validGame({ title: 'Nome novo', developerId: dev.id }))
  assert.equal(edited.slug, game.slug)
  assert.equal(edited.title, 'Nome novo')
  assert.equal(edited.developer.name, 'Estúdio Teste')

  devs.deleteDeveloper(db, dev.id)
  assert.equal(games.getGame(db, game.id).developer, null)

  games.deleteGame(db, game.id)
  assert.equal(games.getGame(db, game.id), null)
  assert.throws(() => games.deleteGame(db, game.id), /não encontrado/)
})

test('painel do estúdio lista só os jogos dele', () => {
  const { db, orvalho, lume, orvalhoUser } = studioDb()
  games.createGame(db, validGame({ title: 'Jogo do Orvalho', developerId: orvalho.id }))
  games.createGame(db, validGame({ title: 'Jogo do Lume', developerId: lume.id }))
  assert.equal(games.listAllGames(db).length, 2)
  assert.deepEqual(games.listAllGames(db, scopeFor(orvalhoUser)).map((g) => g.title), ['Jogo do Orvalho'])
})

test('jogo: arte da página separada da imagem da vitrine', () => {
  const db = freshDb()
  const game = games.createGame(db, validGame({ characterImage: '/uploads/vitrine.png', art: '/uploads/pagina.png' }))
  assert.equal(game.characterImage, '/uploads/vitrine.png')
  assert.equal(game.art, '/uploads/pagina.png')
  assert.equal(games.getPublicGame(db, game.slug).game.art, '/uploads/pagina.png')
})

test('banco da etapa 2 (jogos sem "art") ganha a coluna com a imagem da vitrine', () => {
  const dir = mkdtempSync(join(tmpdir(), 'trevo-'))
  const path = join(dir, 'etapa2.db')
  const db1 = openDatabase(path)
  // Volta a tabela de jogos para o formato antigo, sem a coluna "art"
  db1.exec('ALTER TABLE games DROP COLUMN art')
  db1.prepare(`INSERT INTO games (slug, title, character_image, status) VALUES ('velho', 'Jogo velho', '/uploads/heroi.png', 'publicado')`).run()
  db1.close()

  const db2 = openDatabase(path)
  const game = games.getPublicGame(db2, 'velho').game
  assert.equal(game.art, '/uploads/heroi.png', 'a página continua com a mesma imagem')
  assert.equal(game.characterImage, '/uploads/heroi.png')
  db2.close()
  openDatabase(path).close() // abrir de novo não quebra
  rmSync(dir, { recursive: true, force: true })
})

// ------------------------------------------------------------------
// BANNERS
// ------------------------------------------------------------------

test('banners: exemplos criam um banner por jogo na página /jogo; a Home começa vazia', () => {
  const db = freshDb()
  seedExamples(db)
  assert.deepEqual(banners.listBanners(db, 'jogos').map((b) => b.link), [
    '/jogo/raizes-de-vidro',
    '/jogo/mare-alta',
    '/jogo/lumen-drift',
  ])
  assert.equal(banners.listBanners(db, 'jogos')[0].alt, 'Raízes de Vidro')
  assert.deepEqual(banners.listBanners(db, 'home'), [])
  assert.throws(() => banners.listBanners(db, 'blog'), (e) => e.status === 404)
})

test('banners: salvar troca a lista inteira, na ordem enviada', () => {
  const db = freshDb()
  const saved = banners.replaceBanners(db, 'home', [
    { image: '/uploads/b.webp', alt: 'Segundo', link: 'https://loja.exemplo.com' },
    { image: '', alt: 'Primeiro', link: '/jogo/raizes-de-vidro' },
  ])
  assert.deepEqual(saved.map((b) => b.alt), ['Segundo', 'Primeiro'])
  banners.replaceBanners(db, 'home', [{ image: '', alt: 'Só um', link: '' }])
  assert.deepEqual(banners.listBanners(db, 'home').map((b) => b.alt), ['Só um'])
  banners.replaceBanners(db, 'home', [])
  assert.deepEqual(banners.listBanners(db, 'home'), [], 'pode ficar sem banner')
})

test('banners: validação recusa dados ruins e não apaga a lista antiga', () => {
  const db = freshDb()
  banners.replaceBanners(db, 'home', [{ image: '', alt: 'Antigo', link: '' }])
  const errorsOf = (list) => {
    try {
      banners.replaceBanners(db, 'home', list)
      return {}
    } catch (e) {
      assert.equal(e.status, 400)
      return e.details
    }
  }
  assert.ok(errorsOf([{ alt: '' }])['banners.0.alt'])
  assert.ok(errorsOf([{ alt: 'Ok', image: 'javascript:alert(1)' }])['banners.0.image'])
  assert.ok(errorsOf([{ alt: 'Ok', link: 'javascript:alert(1)' }])['banners.0.link'])
  assert.ok(errorsOf([{ alt: 'Ok', link: '//site-estranho.com' }])['banners.0.link'])
  assert.ok(errorsOf(Array.from({ length: 9 }, () => ({ alt: 'Ok' }))).banners)
  assert.deepEqual(banners.listBanners(db, 'home').map((b) => b.alt), ['Antigo'])
})

test('banco da etapa 2: os banners da página /jogo vêm dos jogos publicados, uma vez só', () => {
  const dir = mkdtempSync(join(tmpdir(), 'trevo-'))
  const path = join(dir, 'etapa2b.db')
  const db1 = openDatabase(path)
  // Simula o banco antigo: jogos com banner, sem tabela de banners preenchida e sem a anotação
  db1.prepare(`INSERT INTO games (slug, title, banner, status) VALUES ('a', 'Jogo A', '/uploads/a.png', 'publicado')`).run()
  db1.prepare(`INSERT INTO games (slug, title, status) VALUES ('b', 'Jogo B', 'rascunho')`).run()
  db1.exec(`DELETE FROM meta WHERE key = 'banners_from_games'`)
  db1.close()

  const db2 = openDatabase(path)
  assert.deepEqual(banners.listBanners(db2, 'jogos'), [{ id: 1, image: '/uploads/a.png', alt: 'Jogo A', link: '/jogo/a' }])
  banners.replaceBanners(db2, 'jogos', [])
  db2.close()
  const db3 = openDatabase(path)
  assert.deepEqual(banners.listBanners(db3, 'jogos'), [], 'apagados pelo painel não voltam')
  db3.close()
  rmSync(dir, { recursive: true, force: true })
})

// ------------------------------------------------------------------
// TREVO TEAM E EQUIPE DA PÁGINA ABOUT
// ------------------------------------------------------------------

test('Trevo Team: criada sozinha, primeira da lista e não pode ser apagada', () => {
  const db = freshDb()
  devs.createDeveloper(db, { name: 'Aaa Estúdio' })
  const list = devs.listDevelopers(db)
  assert.equal(list[0].name, 'Trevo Team')
  assert.equal(list[0].isTrevo, true)
  assert.equal(list[1].isTrevo, false)
  assert.throws(() => devs.deleteDeveloper(db, list[0].id), /não pode ser apagada/)

  const team = devs.getTeam(db)
  assert.equal(team.members.length, 3)
  assert.equal(team.members[0].nickname, 'TECO')
})

test('integrante: apelido, cargo, descrição e até 3 redes', () => {
  const db = freshDb()
  const trevo = devs.listDevelopers(db)[0]
  const member = {
    name: 'Ana Lima',
    nickname: 'NANA',
    role: 'Programadora · Front-end',
    photo: '',
    description: 'Cuida do site.',
    socials: [{ label: 'Instagram', url: 'https://instagram.com/x' }, { label: 'GitHub', url: 'https://github.com/x' }],
  }
  devs.updateDeveloper(db, trevo.id, { name: 'Trevo Team', members: [member] })
  assert.deepEqual(devs.getTeam(db).members, [member])
  assert.equal(devs.getDeveloper(db, trevo.id).isTrevo, true, 'editar não tira a marca')

  const errorsOf = (m) => {
    try {
      devs.updateDeveloper(db, trevo.id, { name: 'Trevo Team', members: [m] })
      return {}
    } catch (e) {
      return e.details
    }
  }
  assert.ok(errorsOf({ ...member, socials: [{}, {}, {}, {}] })['members.0.socials'])
  assert.ok(errorsOf({ ...member, socials: [{ label: 'X', url: 'javascript:1' }] })['members.0.socials.0.url'])
  assert.ok(errorsOf({ ...member, nickname: 'x'.repeat(31) })['members.0.nickname'])
})

test('banco antigo: integrantes sem os campos novos e "Trevo Team" pelo nome', () => {
  const dir = mkdtempSync(join(tmpdir(), 'trevo-'))
  const path = join(dir, 'antigo-devs.db')
  const db1 = openDatabase(path)
  db1.exec('DELETE FROM developers')
  db1.exec('ALTER TABLE developers DROP COLUMN is_trevo')
  db1.prepare(`INSERT INTO developers (name, members) VALUES ('Trevo Team', '[{"name":"Velho","role":"Arte","photo":""}]')`).run()
  db1.close()

  const db2 = openDatabase(path)
  const list = devs.listDevelopers(db2)
  assert.equal(list.length, 1, 'usou a que já existia, não criou outra')
  assert.equal(list[0].isTrevo, true)
  assert.deepEqual(devs.getTeam(db2).members[0], { name: 'Velho', role: 'Arte', photo: '', nickname: '', description: '', socials: [] })
  db2.close()
  rmSync(dir, { recursive: true, force: true })
})