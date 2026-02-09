import { PageHeader } from "@/components/layout/page-header";
// import { services } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";

export default async function ServicesIndexPage() {
  const services = await prisma.service.findMany();
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title="專業服務"
        description="賴乾淵建築師事務所提供從建築設計、室內規劃到工程管理的全方位專業服務。"
        breadcrumbs={[
          { label: "關於事務所", href: "/about" }, 
          { label: "專業服務" },
        ]}
      />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid gap-12 md:gap-20">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Placeholder */}
              <div className="w-full md:w-1/2 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 aspect-[4/3] flex items-center justify-center relative group">
                {/* 這裡未來應該換成真實圖片 */}
                <span className="text-zinc-400 font-light text-lg">
                  {service.title} 示意圖
                </span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>

              {/* Text Content */}
              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tracking-widest text-orange-600 dark:text-orange-500 uppercase">
                    0{index + 1}
                  </span>
                  <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-700" />
                </div>
                
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {service.title}
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {/* 解析內容中的 bullet points 簡單呈現 */}
                  {service.content?.split('\n').filter(line => line.trim().startsWith('*') || line.trim().match(/^\d\./)).slice(0, 3).map((line, i) => (
                    <li key={i} className="flex items-start text-zinc-500 dark:text-zinc-500 text-sm">
                      <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        <span className="text-zinc-700 dark:text-zinc-300">
                        <ReactMarkdown components={{ p: 'span' }}>
                          {line.replace(/^\*|\d\./, '').trim()}
                        </ReactMarkdown>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link
                    href={`/about/services/${service.slug}`}
                    className="inline-flex items-center text-zinc-900 dark:text-white font-medium group hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                  >
                    詳細介紹
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 py-24 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 dark:text-white">有專案需求與我們討論嗎？</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            我們隨時準備為您提供專業的建議與規劃。
          </p>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-zinc-900 px-8 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            聯絡我們
          </Link>
        </div>
      </div>
    </div>
  );
}
