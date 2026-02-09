import { PageHeader } from "@/components/layout/page-header";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug },
  });

  if (!news || !news.isPublished) {
    notFound();
  }

  // Format date nicely
  const formattedDate = new Date(news.date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title={news.title}
        description={formattedDate}
        breadcrumbs={[
          { label: "最新消息", href: "/news" },
          { label: news.title },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Date & Meta */}
          <div className="flex items-center text-sm text-zinc-500 mb-8 pb-8 border-b border-zinc-100 dark:border-zinc-800">
             <Calendar className="w-4 h-4 mr-2" />
             <time>{formattedDate}</time>
          </div>

          {/* Image Gallery */}
          {news.contentImages && news.contentImages.length > 0 && (
            <div className="mb-16 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {news.contentImages.map((img, index) => (
                  <div key={index} className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative group">
                    <Image
                      src={img}
                      alt={`News Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <article className="prose prose-zinc dark:prose-invert max-w-none mb-16">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </article>

          {/* Back Buttons */}
          <BottomNav 
            links={[
              { label: "返回消息列表", href: "/news" },
              { label: "回到首頁", href: "/" }
            ]} 
          />
        </div>
      </div>
    </div>
  );
}
