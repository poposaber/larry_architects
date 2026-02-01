import { PageHeader } from "@/components/layout/PageHeader";
import { services, history, futureVision } from "@/lib/data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title="關於事務所"
        description="認識賴乾淵建築師事務所的理念、沿革與我們提供的專業服務。"
        breadcrumbs={[{ label: "關於事務所" }]}
      />

      <div className="container mx-auto px-4 py-12 space-y-24">
        
        {/* History & Vision */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* History */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-orange-500 pl-4">{history.title}</h2>
            <div className="prose prose-zinc dark:prose-invert text-zinc-600 dark:text-zinc-300">
              <ReactMarkdown>{history.content}</ReactMarkdown>
            </div>
          </section>

          {/* Future Vision */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-l-4 border-orange-500 pl-4">{futureVision.title}</h2>
            <div className="prose prose-zinc dark:prose-invert text-zinc-600 dark:text-zinc-300">
              <ReactMarkdown>{futureVision.content}</ReactMarkdown>
            </div>
          </section>
        </div>

        {/* Services Section Preview */}
        <section id="services">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">專業服務</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Services We Provide</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.id}
                href={`/about/services/${service.id}`}
                className="group block p-8 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:shadow-lg transition-all hover:-translate-y-1 border border-zinc-100 dark:border-zinc-800"
              >
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex-grow">
                    {service.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-orange-600 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    了解更多 <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
               href="/about/services"
               className="inline-flex h-10 items-center justify-center rounded-sm border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-orange-500 dark:focus-visible:ring-zinc-300"
            >
              查看完整服務項目
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
