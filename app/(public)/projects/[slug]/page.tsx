import { PageHeader } from "@/components/layout/PageHeader";
// import { projects } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { MapPin, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug: slug }
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title={project.title}
        description={project.description}
        breadcrumbs={[
          { label: "建案實績", href: "/projects" },
          { label: project.title },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Project Meta Info */}
          <div className="flex flex-wrap gap-4 md:gap-8 mb-12 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              <Tag className="w-4 h-4 mr-2 text-orange-600" />
              <span className="font-medium text-zinc-900 dark:text-white mr-2">類別:</span>
              {project.category}
            </div>
            {project.location && (
              <div className="flex items-center text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-medium text-zinc-900 dark:text-white mr-2">地點:</span>
                {project.location}
              </div>
            )}
            {project.completionDate && (
              <div className="flex items-center text-sm md:text-base text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-medium text-zinc-900 dark:text-white mr-2">完工:</span>
                {project.completionDate}
              </div>
            )}
          </div>

          {/* Image Gallery (Placeholder for now) */}
          {project.contentImages && project.contentImages.length > 0 && (
            <div className="mb-16 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {project.contentImages.map((img, index) => (
                  <div key={index} className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative group">
                    {img ? (
                      <Image
                        src={img}
                        alt={`Project Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-zinc-400 font-light">Project Image {index + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-none mb-16">
            {project.content ? (
                <ReactMarkdown>{project.content}</ReactMarkdown>
            ) : (
                <p>資料整理中...</p>
            )}
          </article>

          {/* Back Buttons */}
          <BottomNav 
            links={[
              { label: "返回建案列表", href: "/projects" },
              { label: "回到首頁", href: "/" }
            ]} 
          />
        </div>
      </div>
    </div>
  );
}
