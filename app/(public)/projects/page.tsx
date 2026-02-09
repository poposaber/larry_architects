import { PageHeader } from "@/components/layout/page-header";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: '建案實績 | 賴乾淵建築師事務所',
  description: '瀏覽我們在住宅、公共建築與商業空間的精選作品。',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { completionDate: 'desc' },
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title="建案實績"
        description="每一個建築作品，都是我們對土地與生活的深刻回應。"
        breadcrumbs={[{ label: "建案實績" }]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* 未來可以這裡加入 FilterTabs (全部 | 住宅 | 公共 | 商業) */}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                {/* 這裡之後要換成 Image 元件 */}
                 <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-light bg-zinc-200 dark:bg-zinc-800">
                    <span className="sr-only">{project.title}</span>
                    {/* Placeholder visual */}
                    <div className="text-center p-4">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <span className="text-zinc-400 font-light">No Image</span>
                      )}
                    </div>
                 </div>
                 
                 {/* Overlay Effect */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                 
                 {/* Hover Icon */}
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                   <div className="bg-white dark:bg-zinc-950 p-2 rounded-full shadow-lg">
                     <ArrowUpRight className="h-5 w-5 text-orange-600" />
                   </div>
                 </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-wider text-orange-600 dark:text-orange-500 uppercase px-2 py-1 bg-orange-50 dark:bg-orange-950/30 rounded-full">
                    {project.category}
                  </span>
                  {project.completionDate && (
                    <span className="text-xs text-zinc-400 font-mono">
                      {project.completionDate}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                  {project.description}
                </p>

                {project.location && (
                  <div className="flex items-center text-xs text-zinc-400 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <MapPin className="h-3 w-3 mr-1.5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
                    {project.location}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400">目前尚無公開的建案實績。</p>
          </div>
        )}
      </div>
    </div>
  );
}
