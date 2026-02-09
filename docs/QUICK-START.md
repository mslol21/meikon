# 🚀 Quick Start - FinMEI

## Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados

**Opção A: Supabase (Recomendado)**
1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Ir em Settings > Database > Connection String
4. Copiar a URI connection string
5. Adicionar ao `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Opção B: PostgreSQL Local**
```bash
# Instalar PostgreSQL
# Criar banco de dados
createdb finmei

# Adicionar ao .env
DATABASE_URL="postgresql://localhost:5432/finmei"
```

### 3. Gerar NextAuth Secret
```bash
# Windows PowerShell
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Linux/Mac
openssl rand -base64 32
```

Adicionar ao `.env`:
```env
NEXTAUTH_SECRET="seu-secret-gerado"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar Stripe (Modo Teste)

1. Criar conta em [stripe.com](https://stripe.com)
2. Ativar modo de teste
3. Ir em Developers > API keys
4. Copiar as chaves de teste

Adicionar ao `.env`:
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

5. Criar produto:
   - Ir em Products > Add Product
   - Nome: "FinMEI PRO"
   - Preço: R$ 39/mês (recurring)
   - Copiar o Price ID (começa com `price_`)

```env
STRIPE_PRICE_ID="price_..."
```

6. Webhook (configurar depois do deploy):
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 5. Arquivo .env Completo

Criar arquivo `.env` na raiz:

```env
# Database
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 6. Inicializar Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma db push

# (Opcional) Ver banco de dados
npx prisma studio
```

### 7. Executar Aplicação

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## ✅ Testando a Aplicação

### 1. Criar Conta
1. Ir para http://localhost:3000
2. Clicar em "Começar Grátis"
3. Preencher formulário de registro
4. Criar conta

### 2. Fazer Login
1. Usar email e senha cadastrados
2. Será redirecionado para `/dashboard`

### 3. Ver Dashboard
- Visualizar cards de estatísticas (inicialmente zerados)
- Ver gráfico (vazio inicialmente)
- Ver lista de transações (vazia inicialmente)

### 4. Testar Upgrade (Stripe Test Mode)
1. Ir em "Configurações"
2. Clicar em "Fazer Upgrade"
3. Usar cartão de teste: `4242 4242 4242 4242`
4. Data: qualquer data futura
5. CVC: qualquer 3 dígitos
6. Completar checkout

## 🎯 Próximos Passos

Após configuração inicial:

1. **Implementar CRUD de Transações**
   - Criar formulário de transação
   - Listar transações
   - Editar/deletar transações

2. **Adicionar Relatórios**
   - Gráficos detalhados
   - Exportação CSV

3. **Categorias Personalizadas**
   - CRUD de categorias
   - Seletor de ícones/cores

## 🐛 Problemas Comuns

### Erro: "Cannot connect to database"
- Verificar se DATABASE_URL está correto
- Verificar se o banco está acessível
- Testar conexão com `npx prisma db pull`

### Erro: "Invalid NextAuth secret"
- Gerar novo secret
- Verificar se está no .env
- Reiniciar servidor

### Erro: "Stripe error"
- Verificar se as chaves são de teste (começam com `sk_test_` e `pk_test_`)
- Verificar se STRIPE_PRICE_ID está correto

### Página em branco
- Verificar console do navegador
- Verificar terminal para erros
- Limpar cache: `rm -rf .next` e `npm run dev`

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Lint
npm run lint

# Prisma
npx prisma studio          # Visualizar banco
npx prisma db push         # Atualizar schema
npx prisma generate        # Gerar client
npx prisma migrate dev     # Criar migration

# Stripe CLI (para testar webhooks localmente)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🎨 Dados de Teste

### Usuário de Teste
```
Email: teste@finmei.com
Senha: senha123456
```

### Cartões de Teste Stripe
```
Sucesso: 4242 4242 4242 4242
Falha: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
```

## 🚀 Deploy Rápido (Vercel)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variáveis de ambiente no dashboard
# 4. Configurar webhook do Stripe com a URL de produção
```

---

**Tempo estimado de setup**: 5-10 minutos

**Dúvidas?** Consulte o [GUIA-IMPLEMENTACAO.md](./GUIA-IMPLEMENTACAO.md)
