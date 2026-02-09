# 🚀 Configuração Rápida do Banco de Dados

## ⚠️ IMPORTANTE: Configure o Banco ANTES de Usar

O erro "Erro ao criar usuário" acontece porque o banco de dados ainda não está configurado.

---

## 📋 Passo a Passo

### 1️⃣ **Criar Conta no Supabase** (Grátis)

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub/Google
4. Crie um novo projeto:
   - **Name**: finmei
   - **Database Password**: Crie uma senha forte (guarde!)
   - **Region**: South America (São Paulo)
   - Clique em "Create new project"
5. Aguarde ~2 minutos para o projeto ser criado

---

### 2️⃣ **Obter a URL do Banco**

1. No painel do Supabase, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database**
3. Role até **Connection string**
4. Selecione a aba **URI**
5. Copie a URL que começa com `postgresql://`
6. **IMPORTANTE**: Substitua `[YOUR-PASSWORD]` pela senha que você criou

Exemplo:
```
postgresql://postgres.abc123:SUA_SENHA_AQUI@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

---

### 3️⃣ **Configurar o .env**

1. Abra o arquivo `.env` na raiz do projeto
2. Cole a URL do banco na variável `DATABASE_URL`:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.abc123:SUA_SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui-minimo-32-caracteres"

# Stripe (deixe vazio por enquanto)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 4️⃣ **Gerar NEXTAUTH_SECRET**

Execute no terminal:

```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Copie o resultado e cole em `NEXTAUTH_SECRET`

---

### 5️⃣ **Sincronizar o Banco de Dados**

No terminal, execute:

```bash
npm run db:push
```

Você verá:
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema
```

---

### 6️⃣ **Reiniciar o Servidor**

1. Pare o servidor (Ctrl+C no terminal)
2. Limpe o cache:
   ```bash
   Remove-Item -Path ".next" -Recurse -Force
   ```
3. Inicie novamente:
   ```bash
   npm run dev
   ```

---

## ✅ **Testar**

1. Acesse: http://localhost:3000
2. Clique em "Começar Grátis"
3. Preencha o formulário de registro
4. Clique em "Criar Conta"
5. ✅ Deve funcionar!

---

## 🔍 **Verificar Dados (Opcional)**

Para ver os dados criados:

```bash
npm run db:studio
```

Isso abrirá o Prisma Studio em http://localhost:5555

---

## ❌ **Problemas Comuns**

### "Error: P1001: Can't reach database server"
- ✅ Verifique se a URL do banco está correta
- ✅ Verifique se substituiu `[YOUR-PASSWORD]` pela senha real
- ✅ Verifique sua conexão com a internet

### "Error: P3009: migrate could not create the shadow database"
- ✅ Use `npm run db:push` ao invés de `migrate`

### "Invalid `prisma.user.create()` invocation"
- ✅ Execute `npm run db:push` novamente
- ✅ Reinicie o servidor

---

## 📝 **Resumo dos Comandos**

```bash
# 1. Sincronizar banco
npm run db:push

# 2. Limpar cache
Remove-Item -Path ".next" -Recurse -Force

# 3. Iniciar servidor
npm run dev

# 4. (Opcional) Ver dados
npm run db:studio
```

---

## 🎉 **Pronto!**

Após seguir esses passos, o sistema estará 100% funcional!

Se ainda tiver problemas, verifique:
1. ✅ URL do banco está correta no `.env`
2. ✅ Senha foi substituída corretamente
3. ✅ `npm run db:push` foi executado
4. ✅ Servidor foi reiniciado

---

**Tempo estimado**: 5-10 minutos
