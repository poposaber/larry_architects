'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProject, updateProject } from '@/lib/actions';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/lib/definitions';
import Image from 'next/image';
import MarkdownEditor from '@/components/admin/markdown-editor';
import ImageUploader from '@/components/admin/image-uploader';
import ImageGalleryManager from '@/components/admin/image-gallery-manager';// 使用 Discriminated Union 來確保編輯模式下一定有 initialData
type ProjectFormProps = 
  | { mode: 'create'; initialData?: null }
  | { mode: 'edit'; initialData: Project };

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  // Creating a bound action if editing, or standard action if creating
  const action = mode === 'edit' && initialData 
    ? updateProject.bind(null, initialData.id) 
    : createProject;
  
  const [state, dispatch] = useActionState(action, { success: false, message: '' });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/admin/projects" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {mode === 'create' ? '新增建築作品' : `編輯：${initialData?.title ?? ''}`}
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
                  專案標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={initialData?.title}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="例如：森之居"
                />
                {state?.errors?.title && <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    網址代稱 (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    defaultValue={initialData?.slug}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    placeholder="forest-residence"
                  />
                  {state?.errors?.slug && <p className="text-red-500 text-sm mt-1">{state.errors.slug}</p>}
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    分類 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={initialData?.category}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="例如：建築設計"
                  />
                  {state?.errors?.category && <p className="text-red-500 text-sm mt-1">{state.errors.category}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  簡述 (列表頁顯示) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={initialData?.description}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="請輸入專案簡介..."
                />
                {state?.errors?.description && <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>}
              </div>
            </div>

            {/* Image Upload Card - Moved to Center Column */}
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

              {/* Content Images Section */}
              <ImageGalleryManager
                images={initialData?.contentImages}
                title="內容圖片"
                description="這些圖片將顯示在專案詳情頁的最上方。"
                uploadName="contentImagesFiles"
                deleteName="deleteImages"
              />
            </div>

            {/* Content Editor Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">詳細內容</h2>
              <MarkdownEditor
                label="Markdown 內容"
                name="content"
                defaultValue={initialData?.content}
                rows={20}
                placeholder="# 專案介紹..."
                error={state?.errors?.content ? String(state.errors.content) : undefined}
                textareaClassName="text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column: Meta & Actions */}
          <div className="space-y-6">
            
            {/* Status Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">發布設定</h2>
              
              {state?.message && !state.success && (
                <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
                  {state.message}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  defaultChecked={initialData?.isFeatured}
                  className="w-4 h-4 text-orange-600 border-zinc-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 select-none cursor-pointer">
                  設為精選專案 (首頁顯示)
                </label>
              </div>

              <SubmitButton mode={mode} />
            </div>

            {/* Meta Info Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">專案資料</h2>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  地點
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={initialData?.location || ''}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="台北市"
                />
              </div>
              
              <div>
                <label htmlFor="completionDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  完工日期 (YYYY-MM)
                </label>
                <input
                  type="text"
                  id="completionDate"
                  name="completionDate"
                  defaultValue={initialData?.completionDate || ''}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="2024-01"
                />
              </div>
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
