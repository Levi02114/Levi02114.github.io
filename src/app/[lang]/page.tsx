import { type Language, languages, getTranslations } from "@/lib/i18n";
import { getAllPosts } from '@/lib/posts';
import BlogPostList from '@/components/BlogPostList';

export async function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export default async function LangHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const langTyped = lang as Language;
  const t = getTranslations(langTyped);
  const posts = getAllPosts(langTyped);

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700/80">
          Journal
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          {t.posts}
        </h1>
        <p className="mt-3 text-stone-600 text-base leading-relaxed max-w-xl">
          {langTyped === 'ko' ? '최신 글' : 'Latest posts.'}
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-amber-200 via-orange-200 to-transparent" />
      </header>
      <BlogPostList posts={posts} lang={langTyped} />
    </div>
  );
}
