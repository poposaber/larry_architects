import { PageHeader } from "@/components/layout/page-header";
// import { services } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";

import { BottomNav } from "@/components/layout/bottom-nav";
import { prisma } from "@/lib/prisma";

import ReactMarkdown from "react-markdown";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug: slug }
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-20">
      <PageHeader
        title={service.title}
        breadcrumbs={[
          { label: "關於事務所", href: "/about" }, 
          { label: "專業服務", href: "/about/services" },
          { label: service.title },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Image Gallery */}
          {service.contentImages && service.contentImages.length > 0 && (
            <div className="mb-16 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {service.contentImages.map((img, index) => (
                  <div key={index} className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center relative group">
                    <Image
                      src={img}
                      alt={`Service Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Article Content */}
          <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{service.content}</ReactMarkdown>
          </article>

          {/* Back Buttons */}
          <BottomNav
            className="mt-16"
            links={[
              { label: "返回專業服務", href: "/about/services" }, 
              { label: "返回關於事務所", href: "/about" }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
