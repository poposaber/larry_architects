import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  linkText: string;
}

export function DashboardCard({
  title,
  description,
  href,
  linkText = "前往管理"
}: DashboardCardProps) {
  return (
    <Link 
      href={href}
      className="block bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900 transition-all group"
    >
      <h3 className="font-semibold text-lg mb-2 text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-500 text-sm mb-4">
        {description}
      </p>
      <div className="flex items-center text-orange-600 text-sm font-medium">
        {linkText} <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
