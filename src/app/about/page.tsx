import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPageContent } from '@/lib/posts';
import MarkdownContent from '@/components/MarkdownContent';

export const metadata: Metadata = {
  title: 'About Me',
  description: '저와 이 블로그에 대해 알아보세요',
};

export default async function AboutPage() {
  const pageData = await getPageContent('about');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 min-w-0">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {pageData.title}
        </h1>
      </header>

      <hr className="h-px bg-gradient-to-r from-amber-200 via-orange-200 to-transparent border-0 mb-10" />

      <article className="mb-12">
        <MarkdownContent html={pageData.html} />
      </article>

      <footer className="pt-8 border-t border-[color:var(--color-border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group/back cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform group-hover/back:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          홈
        </Link>
      </footer>
    </div>
  );
}
