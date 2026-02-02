import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section - Full Screen Design with Orange Accents */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-20 text-center bg-zinc-50 dark:bg-zinc-950 px-4 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-orange-200/20 rounded-full blur-3xl dark:bg-orange-900/10" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-3xl dark:bg-orange-800/5" />
        </div>

        <div className="relative z-10 space-y-8 max-w-4xl">
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">
            <span className="block text-zinc-900 dark:text-white mb-2">建構生活的</span>
            <span className="block text-orange-600 dark:text-orange-500">未來樣貌</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-600 md:text-xl lg:text-2xl font-light dark:text-zinc-300">
            融合永恆設計與現代機能，打造啟發人心、連結情感的建築空間。
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-12">
          <Link
            href="/projects"
            className="inline-flex h-12 items-center justify-center rounded-sm bg-orange-600 px-10 text-base font-medium text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700 hover:shadow-orange-600/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-700 disabled:pointer-events-none disabled:opacity-50"
          >
            瀏覽作品
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-sm border-2 border-zinc-200 bg-transparent px-8 text-base font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300"
          >
            聯絡我們 <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Project Teaser (Placeholder) */}
      <section className="container mx-auto py-24 px-4">
        <div className="flex items-end justify-between mb-12 border-l-4 border-orange-500 pl-4">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">精選案例</h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">Selected Projects</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholders for project cards */}
          {projects.filter(p => p.isFeatured).map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                <span className="text-zinc-400 font-light">Project Image {project.title}</span>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                  {project.category} • {project.location}
                </p>
                <div className="flex items-center text-sm font-medium text-orange-600 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  查看詳情 <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
             href="/projects"
             className="inline-flex h-10 items-center justify-center rounded-sm border border-zinc-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-orange-500 dark:focus-visible:ring-zinc-300"
          >
            查看更多案例
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
