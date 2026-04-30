'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CategoryNode } from '@/types/post';
import CategorySidebar from '@/components/CategorySidebar';

interface AppShellProps {
  categories: CategoryNode[];
  children: React.ReactNode;
}

export default function AppShell({ categories, children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[rgba(255,250,242,0.88)] backdrop-blur-xl">
        {/* Accent gradient line */}
        <div className="h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Left: hamburger + site name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full text-stone-700 hover:bg-[var(--color-accent-subtle)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-elevated)] cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              href="/"
              className="max-w-[12rem] truncate text-base sm:max-w-none sm:text-lg font-semibold tracking-[0.02em] text-stone-900 hover:text-amber-700 transition-colors"
            >
              <span className="font-mono text-amber-700 mr-1">&gt;</span>Levi02114&#39;s Notes
            </Link>
          </div>

          {/* Right: nav links */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1 mr-2">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-[var(--color-accent-subtle)] rounded-full transition-colors cursor-pointer"
              >
                홈
              </Link>
              <Link
                href="/about"
                className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-[var(--color-accent-subtle)] rounded-full transition-colors cursor-pointer"
              >
                소개
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="w-full flex flex-col md:flex-row md:items-stretch items-start min-h-[calc(100vh-3.5rem)]">
        <CategorySidebar
          categories={categories}
          className="flex-shrink-0"
          mobileOpen={isMobileMenuOpen}
          onMobileOpenChange={setIsMobileMenuOpen}
          showInternalMobileTrigger={false}
        />
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
          <div className="w-full max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
