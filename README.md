# EventManager

Sistema web de gerenciamento de eventos feito com **Next.js**, **Prisma** e **PostgreSQL**.
Tem cadastro e login de usuários, criação de eventos e inscrições.

## O que precisa ter instalado

- [Node.js](https://nodejs.org) (versão 20 ou mais nova)
- [PostgreSQL](https://www.postgresql.org) rodando

## Como rodar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Criar o arquivo `.env`

Na pasta do projeto, crie um arquivo chamado `.env` com:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/eventmanager"
JWT_SECRET="coloque-aqui-um-texto-secreto-com-32-caracteres-ou-mais"
```

- `DATABASE_URL`: endereço do seu banco PostgreSQL (troque usuário, senha e nome do banco).
- `JWT_SECRET`: senha usada para gerar o token de login. Precisa ter **pelo menos 32 caracteres**.

### 3. Criar as tabelas no banco

```bash
npx prisma migrate deploy
npx prisma generate
```

> O primeiro comando cria as tabelas `User`, `Event` e `Registration`.
> O segundo gera o código do Prisma usado pelo projeto.

### 4. Rodar o projeto

```bash
npm run dev
```

Abra no navegador: **http://localhost:3000**

## Como usar

1. Clique em **Criar conta** e cadastre-se.
2. Faça **login**.
3. Em **Criar Evento**, cadastre um evento.
4. Em **Explorar**, veja os eventos e faça sua inscrição.
5. Na página do seu evento, veja a **lista de inscritos**.

## Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Roda em modo de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm start` | Roda a versão de produção (depois do build) |
| `npx prisma studio` | Abre uma tela para ver os dados do banco |
