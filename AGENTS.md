# Agent Documentation

This file contains observations about the codebase structure and conventions for future AI agents working on this project.

## Blog Post Structure (Weblogs)

### Frontmatter Format

All blog posts use the following frontmatter structure:

```yaml
---
author: Author
pubDatetime: 2025-12-20T14:23:00-08:00
title: "Post title here"
slug: post-title-here
featured: false
draft: false
tags:
  - tag1
  - tag2
description: via domain.com
---
```

### Frontmatter Fields

- **author**: Always set to `Author` (constant)
- **pubDatetime**: ISO 8601 format with timezone offset `-08:00` (PST). Format: `YYYY-MM-DDTHH:MM:SS-08:00`
  - Times should be believable (not all at midnight, varied throughout the day)
  - Minutes should be varied (not always :00)
- **title**: The post title, typically a direct quote or summary of the linked article
- **slug**: Kebab-case version of the title, used for URL generation
- **featured**: Boolean, typically `false` for weblog posts
- **draft**: Boolean, typically `false` for published posts
- **tags**: Array of lowercase tags, typically 1-3 tags per post
- **description**: Always in format `via [domain.com]` (no `www.` prefix, just the domain)

### LinkCard Component

The `LinkCard` component is used for weblog posts that link to external articles:

```astro
<LinkCard url="https://example.com/article" />
```

**How it works:**
- Located in `src/components/LinkCard.astro`
- Takes a single `url` prop
- Automatically fetches metadata from the URL (title, description, image, favicon)
- Displays a card with:
  - Optional image thumbnail (if available)
  - Article title (from page metadata)
  - Article description (from page metadata)
  - Domain name with favicon
  - External link indicator (↗)
- Handles errors gracefully, falling back to hostname if metadata fetch fails
- Uses regex to extract metadata from HTML (title, og:description, og:image, favicon)

### Tag Conventions

Tags are lowercase and typically descriptive of the content. Common tag patterns observed:

- **Technology**: `technology`, `hardware`, `software`, `ai`, `programming`
- **Domains**: `audio`, `graphics`, `typography`, `automotive`, `robotics`
- **Topics**: `security`, `politics`, `culture`, `history`, `finance`
- **Concepts**: `algorithms`, `color-theory`, `bit-operations`
- **Companies**: `apple`, `google`, `react`, `nodejs`
- **Misc**: `cool-stuff`, `humor`, `tech-criticism`, `debugging`

Tags are typically 1-3 per post, and should be relevant to the content.

### File Naming

Blog post files are named using the slug (kebab-case) with `.mdx` extension:
- Location: `src/content/blog/YYYY/MM/slug.mdx`
- Example: `src/content/blog/2025/12/chile-salmon-farms.mdx`

### Description Pattern

The description field always follows the pattern:
```
description: via domain.com
```

Where `domain.com` is extracted from the URL (without `www.` prefix). Examples:
- `via jeffgeerling.com`
- `via about.fb.com`
- `via 404media.co`
- `via theguardian.com`

### Date Selection

When creating posts with random dates in a range:
- Choose believable times throughout the day (not all at midnight)
- Vary minutes (not always :00)
- Use PST timezone (`-08:00`)
- Format: `YYYY-MM-DDTHH:MM:SS-08:00`

