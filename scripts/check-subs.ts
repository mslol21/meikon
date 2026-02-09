import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const subs = await prisma.subscription.findMany()
    console.log('Subscriptions:', JSON.stringify(subs, null, 2))
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
