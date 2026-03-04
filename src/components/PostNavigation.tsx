'use client';

import { useState } from 'react';
import Link from 'next/link';
import { type Language } from '@/lib/i18n';
import { type Post } from '@/types/post';

interface PostNavigationProps {
  lang: Language;
  posts: Post[];
  currentSlug?: string;
  postsPerPage?: number;
  className?: string;
}

export default function PostNavigation({
  lang,
  posts,
  currentSlug,
  postsPerPage = 5,
  className = '',
}: PostNavigationProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const displayedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7; // Maximum page numbers to show

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Blog post navigation"
      className={`
        sticky top-0 z-40 bg-[rgba(255,250,242,0.88)] backdrop-blur-xl
        border-b border-[color:var(--color-border)]
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Post titles */}
        <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
          {displayedPosts.map((post, index) => (
            <div key={post.slug} className="flex items-center">
              <Link
                href={`/${lang}/posts/${post.slug}`}
                className={`
                  hover:text-amber-700 transition-colors
                  truncate max-w-[200px]
                  ${
                    currentSlug === post.slug
                      ? 'font-semibold text-amber-700'
                      : 'text-stone-600'
                  }
                `}
                title={post.frontmatter.title}
              >
                {post.frontmatter.title}
              </Link>
              {index < displayedPosts.length - 1 && (
                <span className="mx-2 text-stone-300">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1">
            {/* Previous button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`
                px-3 py-1 rounded-lg text-sm
                ${
                  currentPage === 1
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-600 hover:bg-[var(--color-accent-subtle)]'
                }
              `}
            >
              ←
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-stone-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`
                    px-3 py-1 rounded-lg text-sm min-w-[2rem]
                    ${
                      currentPage === page
                        ? 'bg-stone-900 text-white font-medium'
                        : 'text-stone-600 hover:bg-[var(--color-accent-subtle)]'
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className={`
                px-3 py-1 rounded-lg text-sm
                ${
                  currentPage === totalPages
                    ? 'text-stone-300 cursor-not-allowed'
                    : 'text-stone-600 hover:bg-[var(--color-accent-subtle)]'
                }
              `}
            >
              →
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
