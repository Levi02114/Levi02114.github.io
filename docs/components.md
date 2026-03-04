# Components

Summary of key reusable pieces in `src/components/` and how they fit into pages.

## Language & navigation
- `LanguageToggle` (`use client`): floating pill in `[lang]/layout.tsx` that swaps the leading locale segment while preserving the rest of the path. Props: `currentLang`, optional `className`.
- `LanguageSwitcher` (`use client`): inline links in the top nav to jump between locales on the current route. Prop: `currentLang`.
- `Navigation`: top navigation bar with Home/Posts/About links plus `LanguageSwitcher`. Used by post/category pages can be added elsewhere if desired.

## Content rendering
- `MarkdownContent`: dumb wrapper that renders precomputed HTML via `dangerouslySetInnerHTML`. Styling comes from `.markdown-content` rules in `src/app/globals.css`.
- `BlogPostCard`: card view for a `Post`. Shows category badge, formatted date, title/description, optional cover image, author, and up to three tags.
- `BlogPostList`: grid of `BlogPostCard` with optional section title and empty state messaging.

## Navigation aids
- `PostNavigation` (`use client`): sticky horizontal list of recent post titles with pagination controls. Props: `posts` (sorted array), `currentSlug` (to highlight active), `postsPerPage` (default 5), `lang`.
- `CategorySidebar` (`use client`): collapsible category tree with mobile drawer. Props: `categories` (`CategoryNode[]`), `currentCategory`, `lang`.

## Composition in pages
- `[lang]/layout.tsx` mounts `LanguageToggle`, `PostNavigation`, and `CategorySidebar` around the routed page content.
- `[lang]/page.tsx` (home) renders a single pinned/latest post via `MarkdownContent`.
- `[lang]/posts/[slug]/page.tsx` renders a detail view with hero image, meta, tags, alternate-language link, and `MarkdownContent`.
- `[lang]/category/[category]/page.tsx` renders `BlogPostList` for the filtered set.
- `[lang]/about/page.tsx` renders a standalone Markdown page with an alternate-language link.
