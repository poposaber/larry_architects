'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePageContent } from '@/lib/actions';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '@/components/admin/markdown-editor';

interface EditorFormProps {
  pageKey: string;
  initialContent: string;
  pageTitle: string;
}

const initialState = {
  message: '',
  success: false,
};

export default function PageContentEditor({ pageKey, initialContent, pageTitle }: EditorFormProps) {
  const [state, dispatch] = useActionState(updatePageContent, initialState);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <Link 
              href="/admin/page-contents" 
              className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回列表
            </Link>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  編輯：{pageTitle}
                </h1>
            </div>
        </header>

        <form action={dispatch} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <input type="hidden" name="key" value={pageKey} />

          {state.message && (
            <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 text-sm font-medium ${
                state.success 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            }`}>
                {state.message}
            </div>
          )}
          
          <div className="mb-6">
            <MarkdownEditor
              label="內容 (支援 Markdown 語法)"
              name="content"
              defaultValue={initialContent}
              textareaClassName="h-[500px] p-4 text-base resize-y text-zinc-900 dark:text-white"
              showHint={true}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <SubmitButton />
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
      className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          儲存中...
        </>
      ) : (
        <>
          <Save className="w-4 h-4 mr-2" />
          儲存變更
        </>
      )}
    </button>
  );
}
