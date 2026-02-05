import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageKey } from '@/lib/generated/prisma/client';
import { FileText, ArrowLeft, ArrowRight, Clock } from 'lucide-react';

// 定義頁面與標題的對應關係，方便顯示友善名稱
const PAGE_TITLES: Record<string, string> = {
  [PageKey.INTRO]: '事務所簡介',
  [PageKey.VISION]: '未來期許',
};

// 定義每個頁面的簡短描述
const PAGE_DESCRIPTIONS: Record<string, string> = {
  [PageKey.INTRO]: '編輯「關於我們」頁面中的事務所介紹文字。',
  [PageKey.VISION]: '編輯「關於我們」頁面中的願景與期許內容。',
};

async function getPageContents() {
  const contents = await prisma.pageContent.findMany({
    orderBy: { key: 'asc' },
  });
  return contents;
}

export default async function PageContentsList() {
  const pageContents = await getPageContents();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
            <Link 
              href="/admin" 
              className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回管理中心
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-orange-600" />
              頁面內容管理
            </h1>
            <p className="text-zinc-500 mt-2">選擇您想要編輯的網站頁面內容。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageContents.map((content) => (
            <Link 
              key={content.id} 
              href={`/admin/page-contents/${content.key}`}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-orange-600 transition-colors" />
              </div>
              
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                 {PAGE_TITLES[content.key] || content.key}
              </h3>
              
              <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">
                 {PAGE_DESCRIPTIONS[content.key] || '編輯此頁面的文字內容。'}
              </p>

              <div className="flex items-center text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Clock className="w-3.5 h-3.5 mr-1" />
                最後更新：{content.updatedAt.toLocaleString('zh-TW')}
              </div>
            </Link>
          ))}

          {pageContents.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <p className="text-zinc-500">
                  尚未初始化任何頁面內容。<br/>
                  請確認資料庫是否已執行初始化 (Seed)。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
