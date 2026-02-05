import { PageKey } from '@/lib/generated/prisma/enums'
import { projects, services, intro, futureVision, newsList } from './seed-data'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
  await prisma.user.deleteMany()

  console.log('Table cleared.')

  // 0. Seed Admin User
  const hashedPassword = await bcrypt.hash('admin!test', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@larryarchitects.tw',
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log(`Created admin user: ${admin.email} (Password: admin!test)`)

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
  for (const newsItem of newsList) {
    const createdNews = await prisma.news.create({
      data: {
        title: newsItem.title,
        slug: newsItem.slug,
        content: newsItem.content,
        coverImage: newsItem.coverImage,
        date: newsItem.date,
        isPublished: newsItem.isPublished
      }
    })
    console.log(`Created news: ${createdNews.title}`)
  }

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
