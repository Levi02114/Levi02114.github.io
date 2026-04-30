import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Post } from '@/types/post';
import { buildCategoryHref } from '@/lib/paths';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="group relative rounded-[1.35rem] border border-[color:var(--color-border)] bg-[rgba(255,252,247,0.82)] p-5 transition-all duration-300 ease-out hover:border-amber-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5">
      {/* Featured Image */}
      {post.frontmatter.image && (
        <Link href={`/posts/${post.slug}`} className="block mb-4 cursor-pointer">
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-[color:var(--color-border)]">
            <img
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
          </div>
        </Link>
      )}

      {/* Meta line */}
      <div className="flex items-center gap-2 mb-2.5">
        <Link
          href={buildCategoryHref(post.frontmatter.category)}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
        >
          {post.frontmatter.category}
        </Link>
        <span className="text-stone-300">·</span>
        <time
          dateTime={post.frontmatter.date}
          className="text-xs text-stone-500 tabular-nums"
        >
          {format(new Date(post.frontmatter.date), 'yyyy년 M월 d일', { locale: ko })}
        </time>
      </div>

      {/* Title */}
      <Link href={`/posts/${post.slug}`} className="cursor-pointer">
        <h3 className="text-[1.075rem] font-semibold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors duration-200 line-clamp-2 leading-snug tracking-tight">
          {post.frontmatter.title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-sm text-stone-600 mb-4 line-clamp-2 leading-relaxed">
        {post.frontmatter.description}
      </p>

      {/* Tags */}
      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.frontmatter.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 bg-[var(--color-accent-subtle)] text-stone-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
