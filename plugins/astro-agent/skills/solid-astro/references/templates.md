# Templates

The canonical shapes: an interface file, the component that consumes it, and the service behind them. Copy the structure — the imports, the JSDoc, the props alias — and replace the domain.

## Interface file

Every exported type carries a JSDoc block; every field carries a one-line comment.

```typescript
// src/interfaces/component.interface.ts
import type { CollectionEntry } from 'astro:content';

/**
 * Props for the BlogCard component.
 */
export interface BlogCardProps {
  /** The blog post collection entry to render */
  post: CollectionEntry<'blog'>;

  /** Visual variant affecting card appearance */
  variant?: 'default' | 'featured' | 'compact';

  /** Current locale, used to build the post URL */
  locale?: string;
}
```

```typescript
// src/interfaces/content.interface.ts

/**
 * Filters for a blog post query.
 */
export interface BlogQueryOptions {
  /** Restrict to posts under this locale directory */
  locale?: string;

  /** Restrict to posts carrying this tag */
  tag?: string;

  /** Maximum number of posts to return */
  limit?: number;
}
```

## Component

The props type is imported and aliased to `Props`. The frontmatter destructures, derives, and nothing else — the formatting helper and the URL builder both come from elsewhere.

```astro
---
// src/components/blog/BlogCard.astro
import type { BlogCardProps } from '../../interfaces/component.interface';
import { formatDate } from '../../lib/utils';
import { getRelativeLocaleUrl } from 'astro:i18n';

type Props = BlogCardProps;

const { post, variant = 'default', locale = 'en' } = Astro.props;

const { title, description, pubDate } = post.data;
const postUrl = getRelativeLocaleUrl(locale, `blog/${post.id}`);
---

<article class:list={['blog-card', `blog-card--${variant}`]}>
  <time datetime={pubDate.toISOString()}>{formatDate(pubDate, locale)}</time>
  <h2><a href={postUrl}>{title}</a></h2>
  <p>{description}</p>
</article>
```

A layout follows the same shape and exposes its extension points as named slots (`<slot name="header" />`, `<slot />`, `<slot name="footer" />`) so pages extend it by filling slots instead of editing it.

## Service

One responsibility per function, options passed as a typed object, JSDoc on both.

```typescript
// src/lib/blog.ts
import { getCollection, getEntry } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { BlogQueryOptions } from '../interfaces/content.interface';

type BlogPost = CollectionEntry<'blog'>;

/**
 * Fetch published blog posts, newest first.
 *
 * @param options - Locale, tag, and limit filters
 * @returns Sorted array of blog posts
 */
export async function getBlogPosts(options: BlogQueryOptions = {}): Promise<BlogPost[]> {
  const { locale, tag, limit } = options;

  const posts = await getCollection('blog', (entry) => {
    if (locale && !entry.id.startsWith(`${locale}/`)) return false;
    if (tag && !entry.data.tags?.includes(tag)) return false;
    return true;
  });

  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get one blog post by slug.
 *
 * @param slug - Post slug, without the locale prefix
 * @param locale - Locale directory prefix
 * @returns The post, or undefined when no entry matches
 */
export async function getBlogPostBySlug(slug: string, locale = 'en'): Promise<BlogPost | undefined> {
  return getEntry('blog', `${locale}/${slug}`);
}
```

Confirm collection and i18n signatures with `consult-astro-docs` before adapting these.
