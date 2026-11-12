# API da Trevo Team (backend do blog)

Backend em **Node.js + Express** com banco **SQLite** (o que já vem no Node).
Guarda os posts do blog, as desenvolvedoras e as imagens, e cuida dos logins do painel
(a equipe da Trevo e os estúdios).

## Requisitos

- **Node.js 22.13 ou mais novo** (recomendado: Node 24 LTS). Confira com `node -v`.

## Rodar no computador

```bash
cd server
npm install
cp .env.example .env        # no Windows: copy .env.example .env
```

Abra o `.env` e preencha:

- `TOKEN_SECRET`: gere um com
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `ADMIN_EMAIL` e `ADMIN_PASSWORD`: o login do painel (criado na primeira vez que o servidor liga)

Depois:

```bash
npm run dev     # liga a API em http://localhost:3001
npm test        # roda os testes automáticos
```

No front (pasta de cima), crie um arquivo `.env` com:

```
VITE_API_URL=http://localhost:3001
```

e rode `npm run dev` normalmente. O painel fica em `http://localhost:5173/login`.

## Estrutura

```
server/
├── src/
│   ├── index.js          liga o servidor
│   ├── app.js            segurança, rotas e erros
│   ├── config.js         lê o .env
│   ├── db.js             banco e tabelas
│   ├── seed.js           posts de exemplo (fictícios)
│   ├── middleware/auth.js  protege as rotas do painel (login e só admin)
│   ├── routes/           auth, posts, developers, accounts, uploads
│   └── services/         regras: posts, desenvolvedoras, logins, permissões, senha, token, validação
├── test/                 testes automáticos (npm test)
├── data/                 banco (criado sozinho; não vai para o GitHub)
└── uploads/              imagens enviadas (não vão para o GitHub)
```

## Logins e permissões

Existem dois tipos de login:

| | Admin (equipe da Trevo) | Estúdio |
| --- | --- | --- |
| Quem cria | o `.env` (primeira vez que a API liga) | o admin, no painel |
| Posts | todos | só os do estúdio dele |
| Desenvolvedoras | criar, editar e apagar todas | só editar a dele |
| Logins dos estúdios | criar, trocar senha e apagar | não |

- Um post é "do estúdio" quando o **Developed By** dele é aquele estúdio.
- Quando um estúdio cria ou edita um post, o Developed By é sempre o dele.
- Apagar uma desenvolvedora apaga os logins dela (os posts continuam, sem Developed By).
- As regras ficam em `src/services/permissions.js`.

Rotas dos logins de estúdio (só admin): `GET/POST /api/admin/accounts`,
`PUT/DELETE /api/admin/accounts/:id`.

Bancos criados antes dos logins de estúdio são atualizados sozinhos quando a API liga:
a conta que já existia vira admin e nada se perde.

## Segurança

- Senha guardada com hash **scrypt** e sal aleatório (nunca em texto).
- Login com token assinado (JWT HS256) que vale 8 horas.
- Máximo de 5 tentativas de login erradas a cada 15 minutos por IP.
- Só o endereço do front (`FRONT_URL`) pode chamar a API (CORS).
- Upload só de JPG, PNG, WEBP e GIF até 5 MB, conferindo o conteúdo do arquivo e com nome aleatório.
- Todos os campos são validados no servidor; os textos são mostrados como texto (sem HTML).

## Publicar na internet

O banco e as imagens são **arquivos**, então a hospedagem do backend precisa de
**disco persistente** (senão tudo some quando o servidor reinicia):

- **Railway**: crie um *Volume* e aponte `DB_PATH=/data/trevo.db` e `UPLOAD_DIR=/data/uploads`.
- **Render**: use um *Persistent Disk* (plano pago) com os mesmos caminhos.
- **Fly.io**: use um *Volume* montado em `/data`.

Na hospedagem do backend, configure as variáveis do `.env.example`
(com `NODE_ENV=production`), comando de início `npm start` e pasta raiz `server`.

No front (Vercel ou Netlify), configure `VITE_API_URL` com o endereço público da API
e coloque o endereço do front em `FRONT_URL` no backend.