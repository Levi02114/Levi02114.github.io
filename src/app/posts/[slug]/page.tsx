import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { buildCategoryHref } from '@/lib/paths';
import MarkdownContent from '@/components/MarkdownContent';

const POST_PLACEHOLDER = '__placeholder__';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  if (posts.length === 0) {
    return [{ slug: POST_PLACEHOLDER }];
  }

  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === POST_PLACEHOLDER) {
    return {
      title: 'Post Not Found',
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      publishedTime: post.frontmatter.date,
      authors: post.frontmatter.author ? [post.frontmatter.author] : undefined,
      tags: post.frontmatter.tags,
      images: post.frontmatter.image ? [post.frontmatter.image] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === POST_PLACEHOLDER) {
    notFound();
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-6 sm:py-10 min-w-0">
      {/* Header */}
      <header className="mb-10">
        {/* Category */}
        <div className="mb-4">
          <Link
            href={buildCategoryHref(post.frontmatter.category)}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {post.frontmatter.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-900 tracking-tight leading-[1.15] text-balance">
          {post.frontmatter.title}
        </h1>

        {/* Description */}
        {post.frontmatter.description && (
          <p className="text-lg text-stone-600 mb-6 leading-relaxed">
            {post.frontmatter.description}
          </p>
        )}

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
          {/* Date */}
          <time dateTime={post.frontmatter.date} className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(new Date(post.frontmatter.date), 'yyyy년 M월 d일', { locale: ko })}
          </time>

          {/* Author */}
          {post.frontmatter.author && (
            <>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.frontmatter.author}
              </span>
            </>
          )}
        </div>

        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5">
            {post.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[11px] font-medium bg-[var(--color-accent-subtle)] text-stone-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-amber-200 via-orange-200 to-transparent mb-10" />

      {/* Featured Image */}
      {post.frontmatter.image && (
        <div className="mb-10">
          <img
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            className="w-full rounded-xl border border-[color:var(--color-border)]"
          />
        </div>
      )}

      {/* Content */}
      <MarkdownContent html={post.html} />

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[color:var(--color-border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors group/back cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform group-hover/back:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          홈
        </Link>
      </footer>
    </article>
  );
}
