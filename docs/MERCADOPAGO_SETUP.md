# Configuração do MercadoPago

Este documento descreve como configurar o MercadoPago para assinaturas no MEIKon.

## 1. Credenciais no .env
As chaves já foram configuradas no seu arquivo `.env`:
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_PUBLIC_KEY`

## 2. Configuração do Webhook
Para que o sistema receba confirmações de pagamento e atualizações de assinatura automaticamente:

1. Acesse o [Painel do Desenvolvedor do MercadoPago](https://www.mercadopago.com.br/developers/panel/notifications/webhooks).
2. Clique em **Criar Webhook** ou selecione sua aplicação.
3. No campo **URL de produção**, insira:
   `https://seu-dominio.com/api/mercadopago/webhook`
4. Em **Eventos**, selecione:
   - `Assinaturas (Preapprovals)`
5. Salve as alterações.

## 3. Fluxo de Assinatura
- O sistema utiliza o recurso de **PreApproval** do MercadoPago para pagamentos recorrentes.
- Ao clicar em "Fazer Upgrade", o usuário é redirecionado para o checkout do MercadoPago.
- Existe um período de teste de 14 dias configurado no código (`app/api/mercadopago/checkout/route.ts`).

## 4. Gerenciamento de Assinatura
Diferente do Stripe, o MercadoPago não possui um "Portal de Faturamento" pré-pronto que podemos redirecionar com um clique. Os usuários podem gerenciar suas assinaturas diretamente em suas contas do MercadoPago ou você pode implementar uma rota de cancelamento utilizando o `id` da assinatura armazenado no banco de dados.
