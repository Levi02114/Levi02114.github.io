import fs from 'fs';
import path from 'path';
import { parseMarkdown, markdownToHtml } from '@/lib/markdown';
import type { Post, PostWithHtml, Category, CategoryNode } from '@/types/post';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Directory naming convention helpers
 * - Directories starting with [page] represent individual pages
 *   - At root: standalone pages (e.g., about)
 *   - Inside a category: a single post container
 */
function isPageDirectory(dirName: string): boolean {
  return dirName.startsWith('[page]');
}

function stripPagePrefix(dirName: string): string {
  return dirName.replace(/^\[page\]/, '');
}

/**
 * Extract slug from filename
 * Format: {slug}.md
 * Example: my-post.md -> { slug: 'my-post' }
 */
function parseFilename(filename: string): { slug: string } | null {
  if (!filename.endsWith('.md')) return null;

  const slug = filename.replace(/\.md$/, '');
  return { slug };
}

/**
 * Collect markdown files that represent blog posts.
 * Rules:
 * - Top-level [page]* directories are standalone pages and are ignored for posts
 * - Inside a category directory, [page]<slug> is a post directory containing <slug>.md files
 * - Non-[page] directories represent nested categories
 */
interface PostFileRef {
  filePath: string;
  category: string;
  slug: string;
}

function collectPostFiles(dir: string, categoryPath = '', isRoot = true): PostFileRef[] {
  const files: PostFileRef[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (isPageDirectory(entry.name)) {
        // At root: standalone pages (e.g., [page]about) — skip for posts
        if (isRoot) {
          continue;
        }

        // Inside a category: treat as a post directory
        const slug = stripPagePrefix(entry.name);
        const category = categoryPath || 'uncategorized';
        const postEntries = fs.readdirSync(fullPath, { withFileTypes: true });

        for (const postFile of postEntries) {
          if (postFile.isFile() && postFile.name.endsWith('.md')) {
            const parsed = parseFilename(postFile.name);
            if (parsed && parsed.slug === slug) {
              files.push({
                filePath: path.join(fullPath, postFile.name),
                category,
                slug,
              });
            }
          }
        }
      } else {
        // Nested category
        const nextCategory = categoryPath ? `${categoryPath}/${entry.name}` : entry.name;
        files.push(...collectPostFiles(fullPath, nextCategory, false));
      }
    }
  } catch (error) {
    // Directory doesn't exist yet
    return [];
  }

  return files;
}

// Cache for post file references
let postFileCache: PostFileRef[] | null = null;

function getPostFiles(): PostFileRef[] {
  if (!postFileCache) {
    postFileCache = collectPostFiles(contentDirectory);
  }
  return postFileCache;
}

/**
 * Collect category directory paths even if they do not yet contain posts
 */
function collectCategoryDirectories(dir: string, categoryPath = ''): string[] {
  const categories: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory() || isPageDirectory(entry.name)) {
        continue;
      }

      const nextCategory = categoryPath ? `${categoryPath}/${entry.name}` : entry.name;
      categories.push(nextCategory);
      categories.push(...collectCategoryDirectories(path.join(dir, entry.name), nextCategory));
    }
  } catch (error) {
    return [];
  }

  return categories;
}

// Cache for category directories
let categoryDirCache: string[] | null = null;

function getCategoryDirectories(): string[] {
  if (!categoryDirCache) {
    categoryDirCache = collectCategoryDirectories(contentDirectory);
  }
  return categoryDirCache;
}

/**
 * Read and parse a markdown file
 */
function readPostFile(
  filePath: string,
  category: string,
  parsedFromPath?: { slug: string }
): Post | null {
  const filename = path.basename(filePath);
  const parsed = parsedFromPath || parseFilename(filename);

  if (!parsed) return null;

  const { slug } = parsed;
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content, data } = parseMarkdown(fileContent);

  // Validate required frontmatter fields
  if (!data.title || !data.description || !data.date) {
    console.warn(`Missing required frontmatter in ${filePath}`);
    return null;
  }

  return {
    slug,
    content,
    frontmatter: {
      title: data.title,
      description: data.description,
      date: data.date,
      category: data.category || category,
      tags: data.tags || [],
      author: data.author || '',
      featured: data.featured || false,
      pinned: data.pinned || false,
      image: data.image,
    },
  };
}

/**
 * Get all posts
 * @returns Array of posts sorted by date (newest first)
 */
let allPostsCache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (allPostsCache) return allPostsCache;

  const files = getPostFiles();
  const posts: Post[] = [];

  for (const file of files) {
    const post = readPostFile(file.filePath, file.category, {
      slug: file.slug,
    });

    if (post) {
      posts.push(post);
    }
  }

  // Sort by date (newest first)
  posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );

  allPostsCache = posts;
  return posts;
}

/**
 * Get a single post by slug
 * @param slug - Post slug
 * @returns Post with HTML content or null if not found
 */
export async function getPostBySlug(slug: string): Promise<PostWithHtml | null> {
  const file = getPostFiles().find(f => f.slug === slug);

  if (!file) {
    return null;
  }

  const post = readPostFile(file.filePath, file.category, {
    slug: file.slug,
  });

  if (!post) {
    return null;
  }

  const html = await markdownToHtml(post.content);
  return { ...post, html };
}

/**
 * Get all posts in a specific category
 * @param category - Category slug
 * @returns Array of posts in the category (already sorted by date)
 */
export function getPostsByCategory(category: string): Post[] {
  // Leverage the cached getAllPosts instead of re-reading files
  return getAllPosts().filter(post => post.frontmatter.category === category);
}

/**
 * Get all categories with post counts
 * @returns Array of categories
 */
export function getCategories(): Category[] {
  const files = getPostFiles();
  const categoryCounts = new Map<string, Set<string>>();

  // Count posts per category from existing posts
  for (const file of files) {
    if (!categoryCounts.has(file.category)) {
      categoryCounts.set(file.category, new Set<string>());
    }
    categoryCounts.get(file.category)!.add(file.slug);
  }

  // Include categories that exist on disk even if they have zero posts
  const categoryDirs = getCategoryDirectories();
  for (const categoryPath of categoryDirs) {
    if (!categoryCounts.has(categoryPath)) {
      categoryCounts.set(categoryPath, new Set<string>());
    }
  }

  const categories = Array.from(categoryCounts.entries()).map(([category, slugs]) => ({
    name: category,
    slug: category,
    postCount: slugs.size,
  }));

  // Sort alphabetically by category name (English locale)
  categories.sort((a, b) => a.name.localeCompare(b.name, 'en'));

  return categories;
}

function getAllCategoryPaths(): Set<string> {
  const paths = new Set<string>();
  const posts = getAllPosts();
  posts.forEach(post => paths.add(post.frontmatter.category));
  getCategoryDirectories().forEach(dir => paths.add(dir));
  return paths;
}

function buildCategoryTree(paths: Set<string>): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();

  for (const categoryPath of paths) {
    const parts = categoryPath.split('/');
    let currentPath = '';

    for (const part of parts) {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!categoryMap.has(currentPath)) {
        const node: CategoryNode = {
          name: part,
          slug: currentPath,
          count: 0,
          children: [],
        };
        categoryMap.set(currentPath, node);

        if (parentPath) {
          const parent = categoryMap.get(parentPath);
          if (parent) {
            parent.children.push(node);
          }
        }
      }
    }
  }

  return Array.from(categoryMap.values()).filter(node => !node.slug.includes('/'));
}

function addPostCountsToTree(node: CategoryNode): void {
  node.count = getPostsByCategory(node.slug).length;
  node.children.forEach(child => addPostCountsToTree(child));
}

function sortCategoryTree(node: CategoryNode): void {
  if (node.children.length > 0) {
    node.children.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    node.children.forEach(sortCategoryTree);
  }
}

export function getCategoryTree(): CategoryNode[] {
  const categoryPaths = getAllCategoryPaths();
  const roots = buildCategoryTree(categoryPaths);

  roots.forEach(root => {
    addPostCountsToTree(root);
    sortCategoryTree(root);
  });

  roots.sort((a, b) => a.name.localeCompare(b.name, 'en'));

  return roots;
}

/**
 * Get the pinned post
 * Returns the most recent pinned post, or the most recent post if none are pinned
 * @returns Post with HTML content or null if no posts exist
 */
export async function getPinnedPost(): Promise<PostWithHtml | null> {
  const allPosts = getAllPosts();

  // Find pinned posts
  const pinnedPosts = allPosts.filter(post => post.frontmatter.pinned === true);

  if (pinnedPosts.length > 0) {
    // Return most recent pinned post (already sorted by date)
    return getPostBySlug(pinnedPosts[0].slug);
  }

  // Fallback to most recent post
  if (allPosts.length > 0) {
    return getPostBySlug(allPosts[0].slug);
  }

  return null;
}

/**
 * Get featured posts
 * @param limit - Maximum number of posts to return
 * @returns Array of featured posts
 */
export function getFeaturedPosts(limit?: number): Post[] {
  const allPosts = getAllPosts();
  const featured = allPosts.filter(post => post.frontmatter.featured);

  return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get recent posts
 * @param limit - Maximum number of posts to return
 * @returns Array of recent posts
 */
export function getRecentPosts(limit: number = 10): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, limit);
}

/**
 * Check if a post exists
 * @param slug - Post slug
 * @returns True if post exists
 */
export function postExists(slug: string): boolean {
  return getPostFiles().some(file => file.slug === slug);
}

/**
 * Get intro/landing page content
 * @returns HTML content for the intro section
 */
export async function getIntroContent(): Promise<string> {
  const introPath = path.join(contentDirectory, 'intro.md');

  try {
    const fileContent = fs.readFileSync(introPath, 'utf-8');
    const { content } = parseMarkdown(fileContent);
    const html = await markdownToHtml(content);
    return html;
  } catch (error) {
    // Return empty string if intro file doesn't exist
    return '';
  }
}

/**
 * Get standalone page content from [page] directories
 * @param pageName - Name of the page (e.g., 'about')
 * @returns HTML content and title, or null if not found
 */
export async function getPageContent(
  pageName: string
): Promise<{ html: string; title: string } | null> {
  const pagePath = path.join(contentDirectory, `[page]${pageName}`, `${pageName}.md`);

  try {
    const fileContent = fs.readFileSync(pagePath, 'utf-8');
    const { content, data } = parseMarkdown(fileContent);
    const html = await markdownToHtml(content);

    return {
      html,
      title: data.title || pageName,
    };
  } catch (error) {
    return null;
  }
}
