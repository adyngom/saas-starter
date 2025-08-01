'use client';

import Link from 'next/link';
import { CircleIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

function LoginHeader() {
  return (
    <header className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-foreground">ACME</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <LoginHeader />
      <div className="flex-1 flex items-center justify-center bg-background">
        {children}
      </div>
    </section>
  );
}