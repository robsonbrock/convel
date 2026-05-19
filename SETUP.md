# 🚀 Guia Completo de Setup - ConVEL

## Passo 1: Supabase Setup

### 1.1. Criar Conta Supabase
1. Acesse https://supabase.com
2. Crie uma conta (Google/GitHub)
3. Crie uma nova organização

### 1.2. Criar Projeto
1. Clique em "New Project"
2. Escolha um nome: "ConVEL"
3. Escolha região: "Brazil (São Paulo)"
4. Crie uma senha de banco de dados forte
5. Aguarde a criação (5-10 minutos)

### 1.3. Copiar Credenciais
1. Vá para **Settings > API**
2. Copie:
   - **Project URL:** (coluna "URL")
   - **Anon Key:** (coluna "public/anon")

## Passo 2: Configurar `.env.local`

Crie arquivo `C:\dev\convel\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=sua-chave-super-secreta-com-mais-de-32-caracteres-aqui
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota:** Este arquivo NÃO será commitado no Git (está em .gitignore)

**Exemplo JWT_SECRET:**
```
ConVEL2024@CentroEspiritaSeguranca123456
```

## Passo 3: Executar Migrations

### 3.1. SQL Editor Supabase
1. Abra o painel Supabase
2. Vá para **SQL Editor**
3. Clique em "New Query"

### 3.2. Executar Primeira Migration
1. Abra arquivo: `supabase/migrations/001_create_schema.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em "Run" (atalho: Ctrl+Enter)
5. Espere completar

### 3.3. Executar Segunda Migration
1. Abra arquivo: `supabase/migrations/002_seed_data.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor
4. Clique em "Run"

**Resultado esperado:**
- Tabela `usuarios` criada
- Tabela `leitores` criada
- Tabela `categorias` criada (com 11 categorias)
- Tabela `autores` criada
- Tabela `livros` criada
- Tabela `livro_autores` criada
- Tabela `vendas` criada
- Tabela `emprestimos` criada

## Passo 4: Criar Super-admin

### Opção A: Via SQL (Recomendado para teste)

No SQL Editor do Supabase:

```sql
INSERT INTO usuarios (cpf, nome, email, senha, role, telefone)
VALUES (
  '00000000191',
  'Robson Brock',
  'robsonbrock@gmail.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36jbMeKa',
  'super_admin',
  '11999999999'
);
```

**Credenciais:**
- CPF: `00000000191`
- Email: `robsonbrock@gmail.com`
- Senha: `password` (hash acima)

### Opção B: Via Script CLI (Depois)

Depois criaremos um script de seed automático.

## Passo 5: Iniciar Desenvolvimento

```bash
cd C:\Users\robso\dev\convel

# Instalar dependências (já feito)
npm install

# Iniciar dev server
npm run dev
```

A aplicação rodará em **http://localhost:3000**

## Passo 6: Primeiro Login

1. Acesse http://localhost:3000
2. Será redirecionado para `/auth/login`
3. Preencha:
   - **CPF:** `00000000191`
   - **Email:** `robsonbrock@gmail.com`
   - **Senha:** `password`
4. Clique em "Entrar"
5. Você será redirecionado para o Dashboard

## ✅ Verificação Final

Após fazer login, você deve ver:
- ✅ Header com logo "C" e nome do usuário
- ✅ Sidebar com menu baseado em role
- ✅ Dashboard com widgets
- ✅ Opção de Logout no menu do usuário

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
→ Verifique se `.env.local` tem as credenciais corretas

### "FATAL: no pg_hba.conf entry for host..."
→ Aguarde que o projeto Supabase terminou de inicializar (5-10 min)

### "Invalid JWT"
→ Verifique se `JWT_SECRET` tem mais de 32 caracteres

### Sem permissão para acessar telas
→ Verifique o `role` do usuário no banco (deve ser `super_admin`)

---

## Passo 7: Deploy na Vercel

### 7.1. Conectar GitHub
1. Acesse https://vercel.com/dashboard
2. Clique "Add New > Project"
3. Selecione "GitHub"
4. Selecione repo: `robsonbrock/convel`

### 7.2. Configurar Variáveis de Ambiente
1. Após importar repo, vá para "Settings > Environment Variables"
2. Adicione as 3 variáveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`

### 7.3. Deploy
1. Clique "Deploy"
2. Aguarde a build completar (2-3 min)
3. Sua app estará em: `https://convel.vercel.app` (ou nome customizado)

### 7.4. Deployments Automáticos
- Push para `main` → Deploy automático para produção
- Push para `develop` → Deploy automático (preview)

---

**Precisa de ajuda?** Consulte [README.md](./README.md)
