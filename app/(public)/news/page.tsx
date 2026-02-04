import { PageHeader } from "@/components/layout/PageHeader";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: '最新消息 | 賴乾淵建築師事務所',
  description: '關注我們的最新動態、獲獎消息與建築觀點。',
};

export default async function NewsPage() {
  const newsList = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { date: 'desc' },
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title="最新消息"
        description="關注我們的最新動態、獲獎消息與建築觀點。"
        breadcrumbs={[{ label: "最新消息" }]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {newsList.map((news) => (
            <Link 
              key={news.id} 
              href={`/news/${news.slug}`}
              className="group block bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 sm:p-8 hover:shadow-lg hover:-translate-y-1 transition-all border border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                
                {/* Date Column - Stylish Layout */}
                <div className="flex-shrink-0 flex md:flex-col items-center gap-2 text-zinc-400 dark:text-zinc-500">
                  <span className="text-3xl font-bold text-orange-600 dark:text-orange-500">
                    {news.date.getDate().toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider">
                    {news.date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Content Column */}
                <div className="flex-grow space-y-4">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {/* Simple way to get plain text excerpt would be better, but we'll just show raw content truncated for now or assume it's markdown clean enough */}
                    {news.content.replace(/[#*`]/g, '').slice(0, 100)}...
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-orange-600 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    閱讀更多 <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>

                {/* Optional: Cover Image Thumbnail (if exists) */}
                {news.coverImage && (
                  <div className="hidden md:block w-32 h-24 bg-zinc-200 dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                    {/* Placeholder for Image */}
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                      News Image
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}

          {newsList.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-400">目前尚無最新消息。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
