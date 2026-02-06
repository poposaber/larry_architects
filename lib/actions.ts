'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { PageKey } from '@/lib/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';

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

const updateSchema = z.object({
  content: z.string().min(1, '內容不能為空'),
});

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

const projectSchema = z.object({
  title: z.string().min(1, '標題為必填'),
  slug: z.string().min(1, 'Slug 為必填').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字與連字號'),
  category: z.string().min(1, '分類為必填'),
  description: z.string().min(1, '簡述為必填'),
  content: z.string().min(1, '內容為必填'),
  location: z.string().optional(),
  completionDate: z.string().optional(),
  coverImage: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

async function saveFile(file: File, slug: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure directory exists: public/images/projects/{slug}
  const uploadDir = join(cwd(), 'public', 'images', 'projects', slug);
  await mkdir(uploadDir, { recursive: true });

  // Save file
  const filePath = join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  // Return public URL path
  return `/images/projects/${slug}/${file.name}`;
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

  // Handle File Upload
  const slug = validated.data.slug;
  let coverImagePath = '';
  
  // 1. Cover Image
  const coverImageFile = formData.get('coverImageFile') as File;
  if (coverImageFile && coverImageFile.size > 0 && coverImageFile.name !== 'undefined') {
    try {
      coverImagePath = await saveFile(coverImageFile, slug);
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
          const path = await saveFile(file, slug);
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
        ...validated.data,
        coverImage: coverImagePath || undefined,
        images: savedContentImages, 
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

  // 0. Handle Image Deletions (Content Images)
  // Get list of images marked for deletion
  const imagesToDelete = formData.getAll('deleteImages') as string[];
  
  // 1. Handle New Cover Image Upload
  const coverImageFile = formData.get('coverImageFile') as File;
  if (coverImageFile && coverImageFile.size > 0 && coverImageFile.name !== 'undefined') {
    try {
      coverImagePath = await saveFile(coverImageFile, slug);
    } catch (error) {
      console.error('File upload failed:', error);
      return { success: false, message: '封面圖片上傳失敗' };
    }
  }

  // 2. Handle New Content Images (Append to existing)
  // In this specific implementation, we just save them to the folder.
  // We update the DB `images` array field as well (append new ones).
  const contentImagesFiles = formData.getAll('contentImagesFiles') as File[];
  const newContentImages: string[] = [];
  if (contentImagesFiles.length > 0) {
    for (const file of contentImagesFiles) {
      if (file.size > 0 && file.name !== 'undefined') {
        try {
          const path = await saveFile(file, slug);
          newContentImages.push(path);
        } catch (error) {
          console.error('Content image upload failed:', error);
        }
      }
    }
  }

  try {
    // Get existing images first to append
    const existingProject = await prisma.project.findUnique({ where: { id }, select: { images: true }});
    let currentImages = existingProject?.images || [];

    // Remove deleted images from the list
    if (imagesToDelete.length > 0) {
      currentImages = currentImages.filter(img => !imagesToDelete.includes(img));
      
      // Optional: Delete physical files
      // Warning: This is dangerous if multiple projects somehow share images (unlikely here)
      // or if the path is manipulated.
      // We only delete if it matches our expected path structure to be safe.
      for (const imgPath of imagesToDelete) {
        if (imgPath.startsWith('/images/projects/')) {
          try {
            const fullPath = join(cwd(), 'public', imgPath); // public/images/projects/...
            await unlink(fullPath);
          } catch (err) {
            console.error(`Failed to delete file ${imgPath}:`, err);
          }
        }
      }
    }

    await prisma.project.update({
      where: { id },
      data: {
        ...validated.data,
        coverImage: coverImagePath || undefined,
        images: [...currentImages, ...newContentImages],
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
  if (!id) return;

  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}