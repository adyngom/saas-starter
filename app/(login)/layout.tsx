'use client';

import Link from 'next/link';
import { CircleIcon } from 'lucide-react';
import { ThemeSelector } from '@/components/theme-selector';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <ThemeSelector />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <CircleIcon className="h-5 w-5" />
          <span className="ml-2 text-sm font-medium">Back to home</span>
        </Link>
      </div>
      {children}
    </section>
  );
}