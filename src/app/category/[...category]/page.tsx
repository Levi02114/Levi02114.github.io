import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostsByCategory, getCategories } from '@/lib/posts';
import BlogPostList from '@/components/BlogPostList';

const CATEGORY_PLACEHOLDER = '__placeholder__';

interface PageProps {
  params: Promise<{
    category: string[];
  }>;
}

export async function generateStaticParams() {
  const categories = getCategories();

  if (categories.length === 0) {
    return [{ category: [CATEGORY_PLACEHOLDER] }];
  }

  return categories.map(category => ({
    category: category.slug.split('/'),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryPath = category.map(decodeURIComponent).join('/');

  if (categoryPath === CATEGORY_PLACEHOLDER) {
    return {
      title: 'Category Not Found',
    };
  }

  const categories = getCategories();
  const categoryData = categories.find(c => c.slug === categoryPath);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = `${categoryData.name.charAt(0).toUpperCase() + categoryData.name.slice(1)} Posts`;

  return {
    title,
    description: `${categoryData.name} 카테고리의 모든 포스트를 확인하세요`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryPath = category.map(decodeURIComponent).join('/');

  if (categoryPath === CATEGORY_PLACEHOLDER) {
    notFound();
  }

  const categories = getCategories();
  const categoryData = categories.find(c => c.slug === categoryPath);

  if (!categoryData) {
    notFound();
  }

  const posts = getPostsByCategory(categoryPath);

  return (
    <div className="py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500">
          <li>
            <Link
              href="/"
              className="hover:text-stone-700 transition-colors"
            >
              홈
            </Link>
          </li>
          <li>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-stone-700 font-medium capitalize">
            {categoryData.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2 text-stone-900 tracking-tight capitalize">
          {categoryData.name}
        </h1>
        <p className="text-sm text-stone-600">
          {categoryData.postCount}개의 포스트
        </p>
      </header>

      {/* Posts */}
      <BlogPostList
        posts={posts}
        emptyMessage="이 카테고리에 포스트가 없습니다."
      />

      {/* Back to all posts */}
      <div className="mt-12 pt-8 border-t border-[color:var(--color-border)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          모든 포스트 보기
        </Link>
      </div>
    </div>
  );
}
