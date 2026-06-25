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

      <footer className="flex items-center justify-between gap-4 pt-8 border-t border-[color:var(--color-border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group/back cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform group-hover/back:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          홈
        </Link>
        <a
          href="https://x.com/soevenzui"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter: @soevenzui"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sky-500 transition-colors hover:bg-sky-50 hover:text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.5 6.7c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.6 1-1.5-1.6-4.1-.8-4.7 1.3-.1.4-.1.8 0 1.1-3.3-.2-6.3-1.8-8.3-4.3-1.1 1.8-.5 4.2 1.3 5.3-.6 0-1.2-.2-1.8-.5 0 1.9 1.3 3.5 3.2 3.9-.6.2-1.2.2-1.8.1.5 1.6 2.1 2.8 3.9 2.8-1.7 1.3-3.8 2.1-6 2.1H3c1.9 1.2 4.2 1.9 6.6 1.9 7.9 0 12.4-6.7 12.1-12.7.8-.6 1.4-1.2 1.8-2z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
