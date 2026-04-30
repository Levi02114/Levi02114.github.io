import type { Post } from '@/types/post';
import BlogPostCard from './BlogPostCard';

interface BlogPostListProps {
  posts: Post[];
  title?: string;
  emptyMessage?: string;
}

export default function BlogPostList({
  posts,
  title,
  emptyMessage,
}: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-600">
          {emptyMessage || '아직 작성된 포스트가 없습니다. 곧 추가될 예정입니다!'}
        </p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h2 className="text-2xl font-bold mb-8 text-stone-900 tracking-tight">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
