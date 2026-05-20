# Configuração do Supabase para Desenvolvimento Local

## Problema
Ao fazer login em localhost:3000, o usuário é redirecionado para https://convel.vercel.app/ em vez de permanecer em localhost.

## Causa
O Supabase tem uma **lista de Redirect URLs autorizadas** configurada no projeto. Se uma URL de callback não estiver na lista, o Supabase ignora o parâmetro `redirectTo` e usa uma URL padrão ou a primeira da lista.

## Solução

### 1. Acessar o Supabase Console
- URL: https://app.supabase.com
- Projeto: `dzlsyfsrziyegxbljrjo` (ConVEL)

### 2. Ir para Authentication Settings
- Clique em **Authentication** no menu esquerdo
- Clique em **Redirect URLs**

### 3. Adicionar URLs de Callback para Localhost

**Adicione as seguintes URLs:**

```
http://localhost:3000/api/auth/callback
http://localhost:3001/api/auth/callback
http://127.0.0.1:3000/api/auth/callback
http://localhost:3000
```

⚠️ **IMPORTANTE:** Cada URL deve estar em uma linha diferente

### 4. Salvar Configurações
- Clique em **Save** (botão azul no topo)

---

## URLs Necessárias por Ambiente

### Desenvolvimento Local
- `http://localhost:3000/api/auth/callback`
- `http://localhost:3001/api/auth/callback` (fallback se porta estiver em uso)

### Produção (Vercel)
- `https://convel.vercel.app/api/auth/callback`

### Documentação
- https://supabase.com/docs/guides/auth/social-login/auth-google#add-your-oauth-credentials

---

## Verificação Após Configuração

1. Salve a configuração no Supabase
2. Reinicie o servidor local: `npm run dev`
3. Acesse http://localhost:3000/auth/login
4. Clique em "Entrar com Google"
5. Você deverá permanecer em localhost:3000 após a autenticação

Se ainda estiver sendo redirecionado para vercel.app:
- Limpe os cookies do navegador
- Limpe o cache (Ctrl+Shift+Del em Firefox, Cmd+Shift+Delete em Chrome)
- Tente novamente

---

## Referências
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Configuration](https://supabase.com/docs/guides/auth/social-login/auth-google)
