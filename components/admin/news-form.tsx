'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createNews, updateNews } from '@/lib/actions';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import MarkdownEditor from '@/components/admin/markdown-editor';
import ImageUploader from '@/components/admin/image-uploader';
import ImageGalleryManager from '@/components/admin/image-gallery-manager';
export interface SerializedNews {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  contentImages: string[];
  date: string; // ISO string
  isPublished: boolean;
}

type NewsFormProps = 
  | { mode: 'create'; initialData?: null }
  | { mode: 'edit'; initialData: SerializedNews };

export default function NewsForm({ initialData, mode }: NewsFormProps) {
  const action = mode === 'edit' && initialData 
    ? updateNews.bind(null, initialData.id) 
    : createNews;
  
  const [state, dispatch] = useActionState(action, { success: false, message: '' });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/admin/news" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {mode === 'create' ? '新增消息' : `編輯：${initialData?.title ?? ''}`}
          </h1>
        </header>

        <form action={dispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">基本資訊</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={initialData?.title}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="輸入標題"
                />
                {state?.errors?.title && <p className="text-red-500 text-sm mt-1">{String(state.errors.title)}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Slug (網址) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    defaultValue={initialData?.slug}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    placeholder="news-slug-example"
                  />
                  {state?.errors?.slug && <p className="text-red-500 text-sm mt-1">{String(state.errors.slug)}</p>}
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    發布日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    // Extract YYYY-MM-DD from ISO string or use today
                    defaultValue={initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {state?.errors?.date && <p className="text-red-500 text-sm mt-1">{String(state.errors.date)}</p>}
                </div>
              </div>
            </div>

            {/* Image Upload Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <ImageIcon className="w-5 h-5" />
                圖片管理
              </h2>
              
              {/* Cover Image Section */}
              <ImageUploader
                label="封面圖片"
                subLabel="更換封面"
                name="coverImageFile"
                hiddenName="coverImage"
                previewUrl={initialData?.coverImage}
              />

              {/* Divider */}
              <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

              {/* Content Images */}
              <ImageGalleryManager
                 images={initialData?.contentImages}
                 title="內容圖片"
                 description="這些圖片將顯示在詳情頁的最上方。" 
                 uploadName="contentImagesFiles"
                 deleteName="deleteImages"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">詳細內容</h2>
              <MarkdownEditor
                label="Markdown 內容"
                name="content"
                defaultValue={initialData?.content}
                rows={20}
                placeholder="# 最新消息內容..."
                error={state?.errors?.content ? String(state.errors.content) : undefined}
                textareaClassName="text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">發布設定</h2>
              
              {state?.message && !state.success && (
                <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
                  {state.message}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  id="isPublished"
                  name="isPublished"
                  type="checkbox"
                  defaultChecked={initialData?.isPublished ?? true} // Default to true if new
                  className="w-4 h-4 text-orange-600 border-zinc-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                  公開發布
                </label>
              </div>

              <SubmitButton mode={mode} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {mode === 'create' ? '新增中...' : '儲存中...'}
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? '確認新增' : '儲存變更'}
        </>
      )}
    </button>
  );
}
