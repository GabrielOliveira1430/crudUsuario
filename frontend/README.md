📄 README.md
# 🚀 CRUD Usuários - SaaS Fullstack (RBAC + 2FA + Dashboard)

Sistema completo de gerenciamento de usuários com autenticação segura, controle de acesso (RBAC), dashboard interativo e painel administrativo.

---

## 📌 Tecnologias

### 🔧 Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Access + Refresh Token)
- 2FA (Email)

### 🎨 Frontend
- React + Vite
- TypeScript
- React Query
- Recharts (gráficos)
- Framer Motion (animações)
- Context API (Auth + RBAC)

---

## 🔐 Funcionalidades

### Autenticação
- Login com email e senha
- Verificação em 2 fatores (2FA)
- Tokens (access + refresh)
- Persistência de sessão

### RBAC (Role-Based Access Control)
- Usuário (`USER`)
- Administrador (`ADMIN`)
- Permissões dinâmicas
- Proteção de rotas no frontend e backend

### Dashboard
- Total de usuários
- Usuários ativos
- Quantidade de admins
- Gráfico de crescimento
- Gráfico de distribuição (admin vs user)

### Admin Panel
- Listagem de usuários
- Busca com debounce
- Paginação
- Ordenação (nome, email, role)
- Editar usuário
- Deletar usuário (com permissão)

### UI/UX
- Dark mode / Light mode
- Skeleton loading (estilo SaaS)
- Toasts dinâmicos
- Layout moderno (sidebar + header)

---

## 📂 Estrutura do Projeto


crudUsuario/
├── backend/
│ ├── src/
│ ├── prisma/
│ └── ...
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── ...
│
└── README.md


---

## ⚙️ Como rodar o projeto

### 🔧 Backend

```bash
cd backend

# instalar dependências
npm install

# configurar ambiente
cp .env.example .env

# rodar migrations
npx prisma migrate dev

# popular banco (opcional)
npx ts-node seed.ts

# iniciar servidor
npm run dev
🎨 Frontend
cd frontend

# instalar dependências
npm install

# rodar projeto
npm run dev
🌐 Variáveis de Ambiente (Backend)

Exemplo .env:

DATABASE_URL=postgresql://user:password@localhost:5432/db
JWT_SECRET=seu_secret
EMAIL_HOST=smtp...
EMAIL_USER=...
EMAIL_PASS=...
🔑 Permissões (RBAC)

Exemplo de permissões:

user.create
user.read
user.update
user.delete

👉 Admin possui todas automaticamente.

📊 Endpoints principais
Auth
POST /auth/login
POST /auth/verify-2fa
Users
GET /users
GET /users/me
PUT /users/:id
DELETE /users/:id
GET /users/stats
🧠 Conceitos aplicados
Clean Architecture (separação de camadas)
RBAC (controle por role + permission)
Optimistic UI (React Query)
Debounce em busca
UI baseada em estado (loading/skeleton)
Tema dinâmico (dark/light)
🚀 Próximos passos (melhorias)
Deploy (Vercel + VPS)
Upload de avatar
Logs/Audit trail
Cache com Redis
Testes automatizados (Jest)
👨‍💻 Autor

Gabriel Oliveira


---

# 🧠 EXPLICAÇÃO SIMPLES DO QUE VOCÊ TEM

Você construiu basicamente um **mini SaaS completo**.

## 🔥 Backend
Você tem:

- Autenticação com **2FA**
- Sistema de **roles (ADMIN / USER)**
- Sistema de **permissões reais**
- API estruturada (controller → service → middleware)

👉 Isso já é arquitetura profissional.

---

## 🎨 Frontend
Você tem:

- Dashboard com métricas reais
- Gráficos (crescimento + distribuição)
- Tabela com:
  - paginação
  - busca
  - ordenação
- Tema dark/light
- UI moderna (nível produto SaaS)

---

## 🔐 Segurança
Você implementou:

- JWT
- Refresh token
- Proteção de rota
- RBAC no front e no back

👉 Isso é exatamente o que empresas usam.

---

## ⚙️ Como usar (na prática)

### 1. Rodar backend
```bash
cd backend
npm run dev
2. Rodar frontend
cd frontend
npm run dev
3. Fluxo do sistema
Login
Recebe código 2FA
Valida
Entra no dashboard
Admin acessa /admin
Gerencia usuários