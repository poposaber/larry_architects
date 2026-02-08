'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { PageKey } from '@/lib/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { writeFile, mkdir, unlink, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { randomUUID } from 'node:crypto';
import { updateSchema, projectSchema } from '@/lib/definitions';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // 預設登入後導向至後台首頁
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '帳號或密碼錯誤。';
        default:
          return '發生錯誤，請稍後再試。';
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}

export async function updatePageContent(prevState: any, formData: FormData) {
  const key = formData.get('key') as string;
  const content = formData.get('content') as string;

  if (!Object.values(PageKey).includes(key as PageKey)) {
    return { message: '無效的頁面 Key', success: false };
  }

  const validatedFields = updateSchema.safeParse({ content });

  if (!validatedFields.success) {
    return {
      message: '驗證失敗：內容不能為空',
      success: false,
    };
  }

  try {
    await prisma.pageContent.update({
      where: { key: key as PageKey },
      data: {
        content: validatedFields.data.content,
      },
    });

    // 重新驗證快取，讓前台頁面立即更新
    revalidatePath('/about'); // 假設這是前台顯示這些內容的地方
    revalidatePath('/admin/page-contents');
    
    return { message: '更新成功！', success: true };
  } catch (error) {
    console.error('Failed to update page content:', error);
    return { message: '資料庫錯誤，請稍後再試。', success: false };
  }
}

export async function getPageContents() {
  const contents = await prisma.pageContent.findMany({
    orderBy: { key: 'asc' },
  });
  return contents;
}

async function saveProjectImage(file: File, id: string, isCover: boolean): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use ID for folder structure to ensure stability even if slug changes
  const uploadDir = isCover ? join(cwd(), 'public', 'images', 'projects', id, 'cover') : join(cwd(), 'public', 'images', 'projects', id, 'content');
  await mkdir(uploadDir, { recursive: true });

  // Save file
  const filePath = join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  // Return public URL path
  return isCover ? `/images/projects/${id}/cover/${file.name}` : `/images/projects/${id}/content/${file.name}`;
}

async function deleteProjectFolder(id: string) {
  const dirPath = join(cwd(), 'public', 'images', 'projects', id);
  try {
    await rm(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to delete folder ${dirPath}:`, err);
  }
}

export async function createProject(prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    description: formData.get('description'),
    content: formData.get('content'),
    location: formData.get('location'),
    completionDate: formData.get('completionDate'),
    // coverImage will be handled via file upload
    isFeatured: formData.get('isFeatured') === 'on',
  };

  const validated = projectSchema.safeParse({ ...rawData, coverImage: 'placeholder' }); // temporary placeholder for validation

  if (!validated.success) {
    return {
      success: false,
      message: '驗證失敗',
      errors: validated.error.flatten((issue) => issue.message).fieldErrors,
    };
  }

  // Generate ID upfront to use for folder creation
  const projectId = randomUUID();
  let coverImagePath = '';
  
  // 1. Cover Image
  const coverImageFile = formData.get('coverImageFile') as File;
  if (coverImageFile && coverImageFile.size > 0 && coverImageFile.name !== 'undefined') {
    try {
      coverImagePath = await saveProjectImage(coverImageFile, projectId, true);
    } catch (error) {
      console.error('File upload failed:', error);
      return { success: false, message: '封面圖片上傳失敗' };
    }
  }

  // 2. Content Images (Multiple)
  const contentImagesFiles = formData.getAll('contentImagesFiles') as File[];
  const savedContentImages: string[] = [];
  if (contentImagesFiles.length > 0) {
    for (const file of contentImagesFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        try {
          const path = await saveProjectImage(file, projectId, false);
          savedContentImages.push(path);
        } catch (error) {
          console.error('Content image upload failed:', error);
        }
      }
    }
  }

  try {
    await prisma.project.create({
      data: {
        id: projectId, // Explicitly set the ID
        ...validated.data,
        coverImage: coverImagePath || undefined,
        contentImages: savedContentImages, 
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, message: 'Slug 已被使用，請更換一個。' };
    }
    return { success: false, message: '資料庫錯誤' };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects'); 
  redirect('/admin/projects');
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    category: formData.get('category'),
    description: formData.get('description'),
    content: formData.get('content'),
    location: formData.get('location'),
    completionDate: formData.get('completionDate'),
    // coverImage will be handled via file upload or existing value
    isFeatured: formData.get('isFeatured') === 'on',
  };

  const validated = projectSchema.safeParse({ ...rawData, coverImage: 'placeholder' });

  if (!validated.success) {
    return {
      success: false,
      message: '驗證失敗',
      errors: validated.error.flatten((issue) => issue.message).fieldErrors,
    };
  }
  
  const slug = validated.data.slug;
  let coverImagePath = formData.get('coverImage') as string; // Keep existing if no new file

  // 1. Delete Old Cover Image if New One Uploaded
  const coverImageFile = formData.get('coverImageFile') as File;
  if (coverImageFile && coverImageFile.size > 0 && coverImageFile.name !== 'undefined') {
    try {
      const oldCoverImagePath = await prisma.project.findUnique({
        where: { id },
        select: { coverImage: true },
      }).then(project => project?.coverImage);
      if (oldCoverImagePath && oldCoverImagePath.startsWith('/images/projects/')) {
        try {
          const fullPath = join(cwd(), 'public', oldCoverImagePath);
          await unlink(fullPath);
        } catch (err) {
          console.error(`Failed to delete old cover image ${oldCoverImagePath}:`, err);
        }
      }

      // Use ID for folder path
      coverImagePath = await saveProjectImage(coverImageFile, id, true);
    } catch (error) {
      console.error('File upload failed:', error);
      return { success: false, message: '封面圖片上傳失敗' };
    }
  }



  // 2. Handle Content Images Deletion
  // Get list of images marked for deletion
  const imagesToDelete = formData.getAll('deleteImages') as string[];
  
  // Get existing images first to handle deletions safely before potential overwrites
  let currentImages: string[] = [];
  try {
     const existingProject = await prisma.project.findUnique({ 
        where: { id }, 
        select: { contentImages: true }
     });
     currentImages = existingProject?.contentImages || [];
  } catch (error) {
     return { success: false, message: '找不到原始專案資料' };
  }

  // Remove deleted images from the list and delete physical files
  if (imagesToDelete.length > 0) {
    currentImages = currentImages.filter(img => !imagesToDelete.includes(img));
    
    // Delete physical files
    for (const imgPath of imagesToDelete) {
      if (imgPath.startsWith('/images/projects/')) {
        try {
          const fullPath = join(cwd(), 'public', imgPath);
          // Using unlink is risky if file doesn't exist, so we wrap in try-catch
          await unlink(fullPath);
        } catch (err) {
          // Ignore if file not found (maybe already deleted or concurrency issue)
          // But log other errors
          console.error(`Failed to delete file ${imgPath}:`, err);
        }
      }
    }
  }

  // 3. Handle New Content Images Upload
  const contentImagesFiles = formData.getAll('contentImagesFiles') as File[];
  const newContentImages: string[] = [];
  if (contentImagesFiles.length > 0) {
    for (const file of contentImagesFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        try {
          // Use ID for folder path
          const path = await saveProjectImage(file, id, false);
          newContentImages.push(path);
        } catch (error) {
          console.error('Content image upload failed:', error);
        }
      }
    }
  }

  // 4. Update Database Record
  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...validated.data,
        coverImage: coverImagePath || undefined,
        contentImages: [...currentImages, ...newContentImages],
      },
    });
  } catch (error: any) {
    return { success: false, message: `更新失敗: ${error.message}` };
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  redirect('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  const id = formData.get('id') as string;
  const slug = formData.get('slug') as string;
  if (!id) return;

  try {
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    console.error('Delete failed:', error);
  }

  try {
    // Try to delete both potential locations (ID-based and Slug-based)
    await deleteProjectFolder(id);
  } catch (error) {
    console.error('Failed to delete folder:', error);
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
}

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return projects;
}