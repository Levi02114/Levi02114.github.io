export function buildCategoryHref(categorySlug: string): string {
  const encodedSlug = categorySlug
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');

  return `/category/${encodedSlug}`;
}
