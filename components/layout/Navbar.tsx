import Link from 'next/link';
import { Menu } from 'lucide-react';

const navLinks = [
  { name: '建案實績', href: '/projects' },
  { name: '最新消息', href: '/news' },
  { name: '關於事務所', href: '/about' },
  { name: '聯絡我們', href: '/contact' },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md dark:bg-zinc-950/90 dark:border-zinc-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <span className="text-orange-600 dark:text-orange-500">賴乾淵建築師事務所</span>
          <span className="hidden lg:inline-block text-sm font-normal text-zinc-500 dark:text-zinc-400">| LARRY ARCHITECTS</span>
        </Link>
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-zinc-600 hover:text-orange-600 transition-colors dark:text-zinc-300 dark:hover:text-orange-500"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Mobile Menu Placeholder */}
        <button className="md:hidden p-2 text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500">
          <Menu className="h-6 w-6" />
          <span className="sr-only">切換選單</span>
        </button>
      </div>
    </nav>
  );
}
