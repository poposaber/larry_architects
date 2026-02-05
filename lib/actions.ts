'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { PageKey } from '@/lib/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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