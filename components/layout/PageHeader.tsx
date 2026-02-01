import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: {
    label: string;
    href?: string;
  }[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-zinc-500 mb-4">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            首頁
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-orange-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-zinc-900 dark:text-zinc-50 font-medium">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          {title}
        </h1>
        
        {/* Description */}
        {description && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
