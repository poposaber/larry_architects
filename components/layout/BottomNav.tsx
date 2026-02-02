import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils"; // 假設您有用 cn，如果沒有我用 template string 即可，這裡先用 template string 保險

interface NavItem {
  label: string;
  href: string;
}

interface BottomNavProps {
  links: NavItem[];
  className?: string; // 允許微調外距 (marginTop 等)
}

export function BottomNav({ links, className = "" }: BottomNavProps) {
  return (
    <div className={`pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center md:justify-between gap-6 px-4 md:px-6 ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 transition-colors font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
