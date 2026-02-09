# 💰 MEIKon - Gestão Financeira para MEI

Sistema completo de gestão financeira desenvolvido especificamente para Microempreendedores Individuais (MEI).

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: PostgreSQL (Supabase) + Prisma ORM
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Gráficos**: Recharts

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral das finanças
- Gráficos de receitas e despesas
- Indicadores de limite de transações
- Transações recentes

### 💸 Transações
- ✅ CRUD completo de transações
- ✅ Filtros avançados (tipo, status, datas)
- ✅ Paginação (10 itens por página)
- ✅ Categorias predefinidas e personalizadas
- ✅ Status de pagamento (Pago/Pendente)
- ✅ Validação de limite (Plano Free: 50 transações)

### 📈 Relatórios
- ✅ Exportação para CSV
- ✅ Gráfico de evolução mensal
- ✅ Análise por categoria (Pie Charts)
- ✅ Top 5 categorias de receita/despesa
- ✅ Cards de resumo detalhados

### 🎨 Categorias Personalizadas
- ✅ Criar/Editar/Deletar categorias
- ✅ Seletor de ícones (15 opções)
- ✅ Seletor de cores (10 opções)
- ✅ Preview em tempo real
- ✅ Validação de uso

### ⚙️ Configurações
- Gerenciamento de perfil
- Controle de assinatura
- Gerenciamento de categorias
- Planos Free e PRO

### 📱 Responsividade
- ✅ Menu hamburguer mobile
- ✅ Drawer sidebar
- ✅ Layout 100% responsivo
- ✅ Touch-friendly interface

### 🎯 UX/UI
- ✅ Error boundaries
- ✅ Skeleton loading states
- ✅ Animações suaves
- ✅ Toast notifications
- ✅ Confirmações de ações
- ✅ Formatação pt-BR

## 🏗️ Estrutura do Projeto

```
MEIKon-your-business-cash-flow/
├── app/                          # Next.js App Router
├── components/                   # Componentes React
├── lib/                          # Utilitários
├── prisma/                       # Prisma ORM
└── public/                       # Arquivos estáticos
```

## 🚀 Quick Start

### 1. Clonar e Instalar

```bash
git clone <repository-url>
cd MEIKon-your-business-cash-flow
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```env
# Database (Supabase)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configurar Banco de Dados

```bash
# Sincronizar schema com o banco
npm run db:push

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### 5. Build para Produção

```bash
npm run build
npm start
```

## 📊 Planos

### Free
- ✅ Até 50 transações/mês
- ✅ Relatórios básicos
- ✅ Categorias padrão

### PRO (R$ 39/mês)
- ✅ Transações ilimitadas
- ✅ Relatórios avançados
- ✅ Categorias personalizadas
- ✅ Exportação CSV
- ✅ 14 dias grátis

## 🔐 Segurança

- ✅ Autenticação com NextAuth.js
- ✅ Senhas com bcrypt
- ✅ Sessões JWT
- ✅ Proteção CSRF
- ✅ Validação server-side (Zod)
- ✅ Verificação de ownership
- ✅ Webhook security (Stripe)

## 📚 Documentação

Toda a documentação está na pasta `/docs`:

- **QUICK-START.md** - Guia rápido de 5-10 minutos
- **GUIA-IMPLEMENTACAO.md** - Guia completo de implementação
- **PROJECT-SUMMARY.md** - Resumo do projeto
- **IMPLEMENTACOES-CONCLUIDAS.md** - Features de alta prioridade
- **MEDIA-PRIORIDADE-COMPLETO.md** - Features de média prioridade
- **PROBLEMAS-CORRIGIDOS.md** - Problemas resolvidos

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm start            # Executar produção
npm run lint         # Linting
npm run db:push      # Sync Prisma schema
npm run db:studio    # Prisma Studio
```

## 🎯 Status do Projeto

✅ **Alta Prioridade**: 100% Completo
- Página de Transações
- Página de Relatórios

✅ **Média Prioridade**: 100% Completo
- Categorias Personalizadas
- Melhorias de UX
- Responsividade Mobile

## 📝 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Desenvolvido com

- ❤️ Paixão
- ☕ Muito café
- 🚀 Next.js 14
- 🎨 Tailwind CSS
- 💎 TypeScript

---

**MEIKon** - Gestão Financeira Simples e Eficiente para MEI
