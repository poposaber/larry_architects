import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PageKey } from '@/lib/generated/prisma/client';
import PageContentEditor from '@/components/admin/PageContentEditor';

// Helper to map keys to readable titles (shared or duplicated)
const PAGE_TITLES: Record<string, string> = {
  [PageKey.INTRO]: '事務所簡介',
  [PageKey.VISION]: '未來期許',
};

// Next.js 15: params is now a Promise in dynamic routes
type Props = {
  params: Promise<{
    key: string;
  }>;
};

export default async function EditPageContentPage({ params }: Props) {
  const { key } = await params;

  // 1. Validate Key
  // Check if the key exists in the PageKey enum
  if (!Object.values(PageKey).includes(key as PageKey)) {
    notFound();
  }

  // 2. Fetch Data
  const pageContent = await prisma.pageContent.findUnique({
    where: { key: key as PageKey },
  });

  if (!pageContent) {
    return (
        <div className="p-8 text-center text-red-500">
            找不到對應的內容資料，請確認資料庫種子資料是否完整。
        </div>
    );
  }

  // 3. Render Editor Component
  return (
    <PageContentEditor 
      pageKey={pageContent.key} 
      initialContent={pageContent.content}
      pageTitle={PAGE_TITLES[pageContent.key] || pageContent.key}
    />
  );
}
