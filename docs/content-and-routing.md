# Content & Routing

## Routes
- `/` — language selector (links to `/en` and `/ko`)
- `/[lang]` — language home; shows pinned post (or latest) rendered as full article
- `/[lang]/posts/[slug]` — individual blog post
- `/[lang]/category/[category]` — posts filtered by category
- `/[lang]/about` — standalone About page from `[page]about/about-{lang}.md`

All routes are statically generated via `generateStaticParams`. The `[lang]/layout.tsx` shell loads shared chrome (language toggle, post navigation bar, category sidebar) around page content.

## Content sources
- Blog posts live under per-post directories inside category folders:  
  `content/<categoryPath>/[page]<slug>/<slug>-{lang}.md`
  - `<categoryPath>` can be nested with `/` (e.g., `engineering/frontend`).
  - Only directories starting with `[page]` inside a category are treated as posts.
- Standalone site pages live at the root as `content/[page]<name>/<name>-{lang}.md` (these are excluded from blog listings).
- Optional intro content can be provided at `content/intro-{lang}.md` (used by `getIntroContent`, currently unused in the UI).

### Required frontmatter
```yaml
title: "Readable title"
description: "Short summary"
date: "YYYY-MM-DD"
```

### Optional frontmatter
- `category`: defaults to the directory path (e.g., `engineering/frontend`) if omitted
- `tags`: string array
- `author`: free-form string
- `featured`: boolean; returned by `getFeaturedPosts`
- `pinned`: boolean; highest priority for homepage selection via `getPinnedPost`
- `image`: URL/path for hero/cover rendering on post cards and detail pages

### Multilingual setup
- File suffix denotes language (`-en.md`, `-ko.md`).
- `getAlternateLanguage` links between language versions on post pages when both files exist.
- `LanguageToggle` and `LanguageSwitcher` let users change locales while staying on the same path segment.

## Category model
- Categories are inferred from directory structure. Nested categories are represented with path-like strings (e.g., `engineering/frontend`) and rendered as a tree via `getCategoryTree`.
- `getCategories` returns unique slugs with counts (per base folder) for static parameter generation.
- `CategorySidebar` renders the tree and links to `/[lang]/category/[category]`, handling expansion state and mobile overlay.

## Markdown processing pipeline
1) `parseMarkdown` (`src/lib/markdown.ts`) extracts frontmatter with `gray-matter`.
2) `markdownToHtml` compiles Markdown to HTML via `remark`/`rehype` with:
   - GitHub Flavored Markdown (tables, task lists, strikethrough)
   - Math notation (KaTeX)
   - Syntax highlighting (`rehype-highlight`, GitHub theme)
3) `MarkdownContent` injects the HTML into the page with Tailwind-based prose styles defined in `src/app/globals.css`.

## Static generation inputs
- Adding or renaming Markdown files changes the outputs of `generateStaticParams` for posts and categories. Run `npm run build` to regenerate static routes before export/deploy.
