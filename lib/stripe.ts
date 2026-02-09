import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51P'

export const stripe = new Stripe(secretKey, {
  apiVersion: '2025-02-24.acacia' as any,
  typescript: true,
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!
