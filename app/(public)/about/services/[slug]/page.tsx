import { PageHeader } from "@/components/layout/PageHeader";
import { services } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

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

          {/* Back Button */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/about"
              className="inline-flex items-center text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 transition-colors font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回關於事務所
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
