# Architecture

This site is a statically exported Next.js 16 app that renders content sourced from local Markdown. The app router drives routing and layout, while simple utilities in `src/lib` convert Markdown into HTML for the React components in `src/components`. Tailwind CSS powers styling, with a small set of global prose overrides for rendered Markdown.

## Tech stack
- Next.js 16 (App Router) with `output: 'export'` for static builds and unoptimized images
- React 19
- TypeScript with path alias `@/*` -> `src/*`
- Tailwind CSS 3 + PostCSS/Autoprefixer
- Markdown toolchain: `gray-matter`, `remark` + `rehype` (GFM, math/KaTeX, syntax highlighting)

## Directory map
- `src/app/` — App Router routes and layouts
  - `layout.tsx` — root shell that injects global styles
  - `[lang]/` — language-specific shell and pages (home, post, category, about)
- `src/components/` — presentation components (post cards, navigation, language switchers, Markdown renderer, category tree)
- `src/lib/` — data helpers for Markdown parsing (`markdown.ts`), blog querying (`posts.ts`), and i18n (`i18n.ts`)
- `src/types/` — shared TypeScript interfaces (`Post`, `CategoryNode`, etc.)
- `content/` — Markdown source (blog posts and standalone pages)
- `public/` — static assets served as-is
- `out/` — build artifact from `next export` (safe to delete/regenerate)

## Data flow
1) Markdown files in `content/` provide frontmatter + body. Filenames follow `{slug}-{lang}.md`; directories prefixed with `[page]` are treated as standalone pages (e.g., About) rather than blog categories.
2) `src/lib/posts.ts` reads the filesystem, filters by language, validates required frontmatter, and returns `Post` objects sorted by date.
3) Page files under `src/app/[lang]/**` call `get*` helpers (e.g., `getPinnedPost`, `getPostsByCategory`, `getPageContent`) to assemble data for rendering.
4) Markdown bodies are converted to HTML via `markdownToHtml` (remark/rehype pipeline with GFM, math, and syntax highlighting) and injected via the `MarkdownContent` component.
5) UI components (cards, navigation, sidebars) render the data, using Tailwind utility classes and a few custom prose styles in `src/app/globals.css`.

## Rendering model
- Static generation: `generateStaticParams` in each dynamic route precomputes all language/category/slug permutations. `next.config.mjs` sets `output: 'export'`, so `next build && next export` emits a static site to `out/`.
- No client-side data fetching is needed; all content is bundled at build time from the local `content/` directory.
- Dark mode uses Tailwind's `darkMode: 'media'` setting, inheriting from the user's OS preference.

## Key conventions
- Languages: two-letter codes from `src/lib/i18n.ts` (`en`, `ko`). The first path segment always denotes language.
- Categories: derived from the first folder level under `content/` (excluding `[page]*`). Nested categories are supported via `category` paths like `engineering/frontend`.
- Frontmatter is required to include `title`, `description`, and `date`. Optional flags: `featured`, `pinned`, `image`, `tags`, `author`.
- Alternate-language detection: `getAlternateLanguage` checks for a matching `{slug}-{otherLang}.md` to link cross-language versions.
