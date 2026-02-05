'use server';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';

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
