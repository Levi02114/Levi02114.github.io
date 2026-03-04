# Development Guide

## Setup
```bash
npm install
npm run dev     # start Next.js dev server
npm run lint    # Next.js lint
npm run build   # SSG build (writes .next)
npm run start   # serve built output
```

Static export is enabled via `next.config.mjs` (`output: 'export'`, `images.unoptimized: true`). After `npm run build`, run `next export` (or `npx next export`) if you need the `out/` folder.

## Content authoring
- Blog posts: add `content/<categoryPath>/[page]<slug>/<slug>-<lang>.md` with required frontmatter (`title`, `description`, `date`). Categories are derived from the directory path; nested folders are allowed (e.g., `engineering/frontend/[page]state-machines/state-machines-en.md`).
- File naming must match the `[page]` folder slug (e.g., `[page]state-machines/state-machines-en.md`).
- Standalone pages: add `content/[page]<name>/<name>-<lang>.md` at the root (e.g., `[page]about/about-en.md`).
- Flags: use `pinned: true` for homepage selection priority, `featured: true` for featured listings, `image` for hero/card cover, `tags` array for chips.
- Language support: provide parallel files with the same slug and language suffix to enable cross-links. Supported languages live in `src/lib/i18n.ts` (`languages` array).

## Routing patterns
- Language segment is always first. Links should include `/${lang}`.
- Dynamic routes are prebuilt from filesystem data:
  - Posts: `[lang]/posts/[slug]` from `getAllPosts`
  - Categories: `[lang]/category/[category]` from `getCategories`
  - About: `[lang]/about` from `getPageContent('about', lang)`
- To add new dynamic sections, mirror the pattern: add a `generateStaticParams` that enumerates all needed combos using `src/lib` helpers.

## Styling
- Tailwind utilities are available project-wide; dark mode follows `prefers-color-scheme` (`darkMode: 'media'` in `tailwind.config.ts`).
- Markdown-specific prose styles live in `src/app/globals.css` under the `.markdown-content` class.
- For new components, prefer Tailwind utilities and keep semantic HTML; add small custom CSS to `globals.css` only when needed across pages.

## Utilities reference
- `src/lib/posts.ts`: filesystem-backed queries for posts/categories/pages. Use `getAllPosts` for lists, `getPostBySlug` for detail HTML, `getCategoryTree` for hierarchical navigation, and `getPageContent` for `[page]*` content.
- `src/lib/markdown.ts`: `parseMarkdown` for frontmatter, `markdownToHtml` for GFM + math + highlighting conversion.
- `src/lib/i18n.ts`: language list, type guard `isValidLanguage`, and label map `languageNames`.

## Deployment notes
- Static hosting friendly (e.g., GitHub Pages). Build and export:
  ```bash
  npm run build
  npx next export   # emits out/
  ```
- Update content and rebuild to regenerate static routes.

## Common tasks
- Add a post:
  1. Create `content/<category>/<slug>-en.md` (and `-ko.md` if available) with frontmatter.
  2. Run `npm run build` to ensure params regenerate.
- Add a category: create a new folder under `content/` and place posts inside; the tree and params update automatically.
- Add a language: extend `languages` in `src/lib/i18n.ts`, ensure translations are added, and provide content files; update any UI copy that assumes only `en`/`ko`.
