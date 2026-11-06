/**
 * TESTES AUTOMÁTICOS DO BACKEND
 * =============================
 * Rodar:  npm test
 *
 * Usam um banco na memória (não mexem no banco de verdade) e conferem
 * senha, token, limite de tentativas, posts e desenvolvedoras.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { openDatabase, ensureAdmin, seedExamples } from '../src/db.js'
import { hashPassword, verifyPassword } from '../src/services/passwords.js'
import { createToken, verifyToken } from '../src/services/tokens.js'
import { createLimiter } from '../src/services/rateLimit.js'
import { checkLogin, changePassword } from '../src/services/users.js'
import * as posts from '../src/services/posts.js'
import * as devs from '../src/services/developers.js'

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
  assert.deepEqual(checkLogin(db, ' EQUIPE@trevo.com ', 'senha-forte-123'), { id: 1, email: 'equipe@trevo.com' })
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
  assert.equal(devs.listDevelopers(db).length, 2)
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
