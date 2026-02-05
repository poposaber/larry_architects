'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from './actions';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Image / Branding */}
      <div className="hidden md:flex flex-col bg-zinc-900 text-white p-12 relative overflow-hidden">
        <div className="relative z-10 flex-grow flex flex-col justify-between">
          <div>
            <div className="text-2xl font-bold tracking-tight mb-2">Larry Architects</div>
            <p className="text-zinc-400">後台管理系統</p>
          </div>
          <div>
            <blockquote className="text-xl font-medium leading-relaxed mb-4">
              &ldquo;建築不僅是空間的營造，更是生活的容器。在這裡，我們紀錄每一個創作的軌跡。&rdquo;
            </blockquote>
            <cite className="not-italic text-sm text-zinc-500">— 賴乾淵建築師事務所</cite>
          </div>
        </div>
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-black/90 z-0" />
        <div className="absolute inset-0 opacity-20 z-[-1]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">歡迎回來</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">請輸入您的帳號密碼以登入系統</p>
          </div>

          <form action={dispatch} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition-all sm:text-sm"
                  placeholder="admin@larry-architects.tw"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 outline-none transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-300">
                  記住我
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  忘記密碼?
                </a>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            )}

            <div>
              <LoginButton />
            </div>
            
            <div className="mt-4 text-center">
                 <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 flex items-center justify-center gap-1 transition-colors">
                    返回首頁 <ArrowRight className="w-4 h-4" />
                 </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
    >
      {pending ? (
        <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            登入中...
        </>
      ) : (
        '登入系統'
      )}
    </button>
  );
}
