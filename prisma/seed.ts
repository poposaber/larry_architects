import { PageKey } from '@/lib/generated/prisma/enums'
import { projects, services, intro, futureVision } from './seed-data'
import { prisma } from '@/lib/prisma'

if (typeof process.loadEnvFile === 'function') {
  process.loadEnvFile()
}

async function main() {
  console.log('Start seeding ...')

  // Clean up existing data
  await prisma.project.deleteMany()
  await prisma.pageContent.deleteMany()
  await prisma.service.deleteMany()
  await prisma.news.deleteMany()

  console.log('Table cleared.')

  // 1. Seed Projects
  for (const project of projects) {
    const createdProject = await prisma.project.create({
      data: {
        title: project.title,
        location: project.location,
        completionDate: project.completionDate,
        description: project.description,
        images: project.images,
        coverImage: project.coverImage,
        slug: project.slug,
        category: project.category,
        content: project.content,
        isFeatured: project.isFeatured
      },
    })
    console.log(`Created project: ${createdProject.title}`)
  }

  // 2. Seed Services
  for (const service of services) {
    const createdService = await prisma.service.create({
      data: {
        title: service.title,
        slug: service.slug, 
        description: service.description,
        image: service.image,
        content: service.content
      },
    })
    console.log(`Created service: ${createdService.title}`)
  }

  // 3. Seed PageContent (About & Vision) using Enum
  // Intro
  await prisma.pageContent.create({
    data: {
        key: PageKey.INTRO,
        content: intro.content
    }
  })
  console.log(`Created PageContent: INTRO`)

  // Vision
  await prisma.pageContent.create({
    data: {
        key: PageKey.VISION,
        content: futureVision.content
    }
  })
  console.log(`Created PageContent: VISION`)

  // 4. Seed News (Example)
  await prisma.news.create({
    data: {
      title: '事務所獲得 2025 台灣建築獎',
      slug: 'award-2025',
      content: '## 獲獎快訊\n\n很高興跟大家分享，賴乾淵建築師事務所以「森之居」一案，榮獲 2025 台灣建築獎優選...',
      coverImage: '/images/news/award.jpg',
      date: new Date('2025-12-15'),
      isPublished: true
    }
  })
  console.log(`Created News example`)
  
  console.log('Seeding finished.')
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
