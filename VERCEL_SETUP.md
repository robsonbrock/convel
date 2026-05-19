# 🚀 Deploy ConVEL na Vercel

## ✅ Mudanças Realizadas

1. **Novo Diretório:** `C:\dev\convel` (antes: `C:\Users\robso\dev\convel`)
2. **Configuração Vercel:** Adicionado `vercel.json`
3. **Git Ignorado:** `.env.local` agora está em `.gitignore`
4. **.gitignore:** Criado arquivo completo para Next.js
5. **Ambiente Production:** Arquivo `.env.production.example` para referência

---

## 📋 Pré-requisitos

- ✅ GitHub: https://github.com/robsonbrock/convel (já configurado)
- ✅ Vercel: Conta já existe
- ⏳ Supabase: Será configurado no próximo passo

---

## 🛠️ Passo 1: Supabase (Local)

### 1. Criar Projeto Supabase

1. Acesse https://supabase.com
2. Crie novo projeto:
   - **Name:** ConVEL
   - **Database Password:** (senha forte)
   - **Region:** Brazil (São Paulo)
3. Aguarde criação (5-10 min)

### 2. Copiar Credenciais

1. Settings > API
2. Copie:
   - `Project URL`
   - `anon public`

### 3. Criar `.env.local` Local

Arquivo: `C:\dev\convel\.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
JWT_SECRET=SuaChaveSegura123456789012345678
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Executar Migrations

No SQL Editor Supabase:

1. Copie `supabase/migrations/001_create_schema.sql`
2. Cole e execute
3. Copie `supabase/migrations/002_seed_data.sql`
4. Cole e execute

### 5. Criar Super-admin

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

### 6. Testar Localmente

```bash
cd C:\dev\convel
npm run dev
# http://localhost:3000
# Login: 00000000191 / robsonbrock@gmail.com / password
```

---

## 🚀 Passo 2: Deploy na Vercel

### 1. Acessar Vercel

https://vercel.com/dashboard

### 2. Importar Projeto

1. Clique "Add New > Project"
2. Selecione "GitHub"
3. Selecione: `robsonbrock/convel`
4. Clique "Import"

### 3. Configurar Variáveis de Ambiente

Na tela de configuração, ou depois em "Settings > Environment Variables":

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
JWT_SECRET = SuaChaveSegura123456789012345678
```

**Importante:** Use os MESMOS valores do `.env.local`

### 4. Deploy

1. Clique "Deploy"
2. Aguarde 2-3 minutos
3. Seu app estará em: `https://convel.vercel.app`

---

## 🔄 Fluxo de Trabalho Futuro

### Local (Desenvolvimento)

```bash
cd C:\dev\convel
npm run dev
# Edite código
# Teste localmente
```

### Push para GitHub

```bash
cd C:\dev\convel
git add .
git commit -m "feat: descrição da mudança"
git push origin develop
```

### Deploy Automático na Vercel

- Push para `develop` → Preview automático
- Push para `main` → Production automático

---

## 🌐 URLs

- **Desenvolvimento Local:** http://localhost:3000
- **Production:** https://convel.vercel.app (após deploy)
- **GitHub:** https://github.com/robsonbrock/convel
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## ⚠️ Variáveis de Ambiente

### Local (`.env.local`)
- Desenvolvimento local
- **NÃO** é commitado no Git

### Vercel (Settings > Environment Variables)
- Production e Preview
- Configurado no dashboard
- Pode ser diferente de local

### `.env.production.example`
- Referência do que é necessário
- É commitado no Git

---

## ✅ Checklist Final

- [ ] Supabase projeto criado
- [ ] Migrations executadas
- [ ] Super-admin criado
- [ ] `.env.local` configurado
- [ ] Teste local funcionando
- [ ] Vercel projeto importado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] App rodando em https://convel.vercel.app

---

**Próximo passo:** Execute a checklist acima! 🚀
