# ConVEL - Sistema de Controle de Vendas e Empréstimos

Sistema web para centralizar o controle de vendas e empréstimos de livros do Centro Espírita.

## 🚀 Fase 1: Conclusão

✅ **Setup Inicial Completo**
- ✅ Projeto Next.js 16 com TypeScript
- ✅ Tailwind CSS configurado (Design Google/Apple)
- ✅ Autenticação com CPF + Email + Senha
- ✅ Sistema de roles (super_admin, admin, vendedor)
- ✅ Schema SQL com 8 tabelas
- ✅ Componentes UI base (Button, Input, Card)
- ✅ Layout com Header e Sidebar
- ✅ Homepage/Dashboard vazia pronta para evoluir

## 📋 Próximas Fases

- **Fase 2:** Gestão de Usuários (super-admin)
- **Fase 3:** Gestão de Categorias e Autores
- **Fase 4:** Gestão de Livros
- **Fase 5:** Registro de Vendas
- **Fase 6:** Registro de Empréstimos
- **Fase 7+:** Relatórios e Dashboards

## 🛠️ Setup Inicial

### 1. Clonar/Usar o Projeto

```bash
cd C:\dev\convel
```

**Nota:** Projeto também disponível em GitHub: https://github.com/robsonbrock/convel

### 2. Criar Projeto Supabase

1. Acesse https://supabase.com
2. Crie uma nova organização e projeto
3. Copie as credenciais:
   - **URL do Projeto:** https://xxxxx.supabase.co
   - **Chave Anon:** (disponível em Settings > API)

### 3. Configurar `.env.local`

Edite `C:\Users\robso\dev\convel\.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=sua-chave-secreta-com-mais-de-32-caracteres
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Executar Migrations

No painel Supabase, acesse **SQL Editor** e execute:

1. `supabase/migrations/001_create_schema.sql`
2. `supabase/migrations/002_seed_data.sql`

**Resultado esperado:**
- 8 tabelas criadas
- 11 categorias pré-cadastradas

### 5. Iniciar Dev Server

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 👥 Roles e Permissões

- **super_admin:** Acesso total
- **admin:** Tudo exceto gestão de usuários
- **vendedor:** Apenas vendas e empréstimos

---

## 🚀 Deploy na Vercel

### Quick Deploy
1. Faça push para GitHub: `https://github.com/robsonbrock/convel`
2. Acesse Vercel Dashboard
3. Clique "Add New > Project"
4. Selecione repo `robsonbrock/convel`
5. Configure variáveis de ambiente (veja `.env.production.example`)
6. Clique "Deploy"

### Variáveis de Ambiente (Vercel Settings)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
JWT_SECRET=your-secret-key-32-chars
```

---

**Desenvolvido com ❤️ para o Centro Espírita**
