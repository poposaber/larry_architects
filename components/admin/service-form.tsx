'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createService, updateService } from '@/lib/actions';
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '@/components/admin/markdown-editor';
import ImageUploader from '@/components/admin/image-uploader';
import ImageGalleryManager from '@/components/admin/image-gallery-manager';

export interface SerializedService {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string | null;
  contentImages: string[];
}

type ServiceFormProps = 
  | { mode: 'create'; initialData?: null }
  | { mode: 'edit'; initialData: SerializedService };

export default function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const action = mode === 'edit' && initialData 
    ? updateService.bind(null, initialData.id) 
    : createService;
  
  const [state, dispatch] = useActionState(action, { success: false, message: '' });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/admin/services" 
            className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            {mode === 'create' ? '新增服務項目' : `編輯：${initialData?.title ?? ''}`}
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
                  服務標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={initialData?.title}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="例如：住宅設計"
                />
                {state?.errors?.title && <p className="text-red-500 text-sm mt-1">{String(state.errors.title)}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  網址路徑 (Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  defaultValue={initialData?.slug}
                  required
                  pattern="[a-z0-9-]+"
                  title="只能包含小寫字母、數字與連字號"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  placeholder="residential-design"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  將作為網址的一部分，只能包含小寫字母、數字與連字號。
                </p>
                {state?.errors?.slug && <p className="text-red-500 text-sm mt-1">{String(state.errors.slug)}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  簡短描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description}
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="請輸入關於此服務的簡短說明..."
                />
                {state?.errors?.description && <p className="text-red-500 text-sm mt-1">{String(state.errors.description)}</p>}
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
                helperText="建議尺寸：1200x630px，支援 JPG, PNG, WebP"
              />

              {/* Divider */}
              <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

              {/* Content Images Section */}
              <ImageGalleryManager
                images={initialData?.contentImages}
                title="內容圖片"
                description="這些圖片將顯示在詳情頁的最上方。"
                uploadName="contentImagesFiles"
                deleteName="deleteImages"
              />
            </div>

            {/* Markdown Editor */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">詳細內容</h2>
              <MarkdownEditor 
                label="Markdown 內容"
                name="content"
                defaultValue={initialData?.content}
                rows={20}
                placeholder="# 服務介紹..."
                error={state?.errors?.content ? String(state.errors.content) : undefined}
                textareaClassName="text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            
            {/* Save Actions */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">建立與發布</h2>
              
              <div className="space-y-4">
                <div className="text-sm text-zinc-500">
                  <p>請確認所有必填欄位皆已填寫。</p>
                </div>
                
                {state.message && (
                  <div className={`p-3 rounded-lg text-sm ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {state.message}
                    {state.errors && (
                      <ul className="mt-2 list-disc list-inside">
                        {Object.entries(state.errors).map(([key, msgs]) => (
                          <li key={key}>{Array.isArray(msgs) ? msgs[0] : msgs}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                
                <SubmitButton />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          處理中...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          儲存服務
        </>
      )}
    </button>
  );
}