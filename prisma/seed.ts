
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@thecawe.com' },
    update: {},
    create: {
      email: 'demo@thecawe.com',
      name: 'Jean Sommelier',
      password,
      role: 'ADMIN'
    },
  })

  // Create a few wines
  const wines = [
    {
      name: 'Château Margaux',
      producer: 'Château Margaux',
      vintage: 2015,
      type: 'RED',
      region: 'Bordeaux',
      country: 'France',
      grapes: 'Cabernet Sauvignon',
      image: 'https://images.vivino.com/thumbs/L2g6sC2CQ4q7F8jXkX9w_g_pb_x960.png' // Placeholder or real
    },
    {
      name: 'Domaine de la Romanée-Conti',
      producer: 'DRC',
      vintage: 2018,
      type: 'RED',
      region: 'Burgundy',
      country: 'France',
      grapes: 'Pinot Noir',
    },
    {
      name: 'Dom Pérignon Vintage',
      producer: 'Moët & Chandon',
      vintage: 2012,
      type: 'SPARKLING',
      region: 'Champagne',
      country: 'France',
      grapes: 'Chardonnay, Pinot Noir',
    }
  ]

  for (const w of wines) {
    const createdWine = await prisma.wine.create({
      data: w
    })

    // Add to user cellar
    await prisma.cellarItem.create({
      data: {
        userId: user.id,
        wineId: createdWine.id,
        quantity: 2,
        buyPrice: 150.0,
        isVisible: true
      }
    })
  }

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
