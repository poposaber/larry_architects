import { PageHeader } from "@/components/layout/PageHeader";
// import { services } from "@/lib/data";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
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
