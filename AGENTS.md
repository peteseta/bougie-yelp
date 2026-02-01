# Agent Documentation

This file contains observations about the codebase structure and conventions for future AI agents working on this project.

## Blog Post Types

The blog supports three distinct post types, each with different purposes and formatting:

1. **Weblogs** - Links to external articles with commentary
2. **Devlogs** - Technical development updates and project notes
3. **Writings** - Long-form original essays and articles

The post type is determined by:

- Explicit `type` field in frontmatter (`weblog`, `devlog`, or `writing`)
- Auto-detection: posts with `description: via domain.com` are weblogs
- Default: posts without explicit type or via-pattern are writings

**Note:** When the post type could be ambiguous (e.g., a devlog that happens to link to an external resource), always set the `type` field explicitly to ensure correct categorization.

---

## Weblogs

Weblogs are short posts that link to external articles, typically with minimal commentary. They appear in the feed with a LinkCard preview.

### Frontmatter Format

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

### Required Components

**LinkCard Component** - Must include exactly one LinkCard:

```astro
<LinkCard url="https://example.com/article" />
```

The LinkCard:

- Is located in `src/components/LinkCard.astro`
- Takes a single `url` prop
- Automatically fetches metadata (title, description, image, favicon)
- Displays a preview card in the feed
- Is extracted by `extractLinkCardUrl()` for feed display

### Optional Commentary

Weblogs can include commentary below the LinkCard using normal markdown text:

```astro
<LinkCard url="https://example.com/article" />

This is an interesting article about... I particularly liked the part where...
```

The commentary appears on the individual post page but does not appear in the feed preview (which only shows the LinkCard).

### Description Pattern

The description field **must** follow the pattern:

```
description: via domain.com
```

Where `domain.com` is extracted from the URL (without `www.` prefix). Examples:

- `via jeffgeerling.com`
- `via about.fb.com`
- `via 404media.co`
- `via theguardian.com`
- `via an.dywa.ng`

---

## Devlogs

Devlogs are technical posts about development work, projects, and implementation details. They appear in the feed with a "devlog" badge.

### Frontmatter Format

```yaml
---
author: Author
pubDatetime: 2025-12-20T14:23:00-08:00
title: "What I built today"
slug: what-i-built-today
type: devlog
featured: false
draft: false
tags:
  - programming
  - react
  - project-name
description: Brief description of the devlog content
---
```

### Key Differences from Weblogs

- **type: devlog** - Must be explicitly set
- **description** - Regular description text, NOT `via domain.com`
- **Content** - Can include code blocks, technical explanations, screenshots
- **No LinkCard** - Devlogs don't use LinkCard components

### Content Guidelines

- Include code examples with proper syntax highlighting
- Explain technical decisions and trade-offs
- Document project progress and milestones
- Share lessons learned and debugging experiences

---

## Writings

Writings are long-form original essays, research, and in-depth articles. They are the default post type and appear with a "writing" badge.

### Frontmatter Format

```yaml
---
author: Author
pubDatetime: 2025-12-20T14:23:00-08:00
modDatetime: 2025-12-21T10:30:00-08:00
title: "My Essay Title"
slug: my-essay-slug
featured: false
draft: false
tags:
  - science
  - research
  - essay
description: A compelling summary of the essay that appears in the feed
---
```

### Key Characteristics

- **type** - Optional (omit or set to `writing`)
- **modDatetime** - Optional, for updated articles
- **description** - Regular description text, NOT `via domain.com`
- **Content** - Full essay content with headers, footnotes, citations
- **No LinkCard** - Writings don't use LinkCard components

### Content Guidelines

- Use proper markdown headers (`#`, `##`, etc.)
- Include footnotes for citations: `[^1]`, `[^2]`, etc.
- Add references section at the end
- Can include images, diagrams, and embedded content
- Academic papers can include `.bib` files in subdirectories

---

## Common Frontmatter Fields

### Required Fields

- **author**: Always set to `Author` (constant)
- **pubDatetime**: ISO 8601 format with timezone offset `-08:00` (PST)
  - Format: `YYYY-MM-DDTHH:MM:SS-08:00`
  - Times should be believable (not all at midnight)
  - Vary minutes (not always :00)
- **title**: The post title
- **slug**: Kebab-case version of the title for URLs
- **description**: Varies by type (see above)

### Optional Fields

- **type**: `weblog`, `devlog`, or `writing` (auto-detected if omitted)
- **featured**: Boolean, `true` for highlighted posts
- **draft**: Boolean, `true` to hide from production
- **modDatetime**: For updated articles (ISO 8601 format)
- **tags**: Array of lowercase strings, 1-3 tags recommended
- **ogImage**: OpenGraph image (1200x630 minimum)
- **canonicalURL**: For cross-posted content
- **editPost**: Object with edit link configuration

---

## File Naming and Location

All post types follow the same file structure:

```
src/content/blog/YYYY/MM/slug.mdx
```

Examples:

- `src/content/blog/2025/12/chile-salmon-farms.mdx` (weblog)
- `src/content/blog/2025/12/notes-on-gamma.mdx` (weblog)
- `src/content/blog/2024/12/scie113-term-paper/index.mdx` (writing with assets)

For posts with multiple assets (images, bib files, etc.), use a subdirectory:

```
src/content/blog/YYYY/MM/slug/
  ├── index.mdx
  ├── image1.png
  ├── references.bib
  └── diagram.svg
```

---

## Tag Conventions

Tags are lowercase and descriptive. Common patterns:

- **Technology**: `technology`, `hardware`, `software`, `ai`, `programming`
- **Domains**: `audio`, `graphics`, `typography`, `automotive`, `robotics`
- **Topics**: `security`, `politics`, `culture`, `history`, `finance`, `medicine`, `science`
- **Concepts**: `algorithms`, `color-theory`, `bit-operations`
- **Companies/Projects**: `apple`, `google`, `react`, `nodejs`
- **Post Types**: `cool-stuff`, `humor`, `tech-criticism`, `debugging`

Keep tags relevant and limit to 1-3 per post.

---

## Visual Indicators

Each post type has distinct styling in the feed:

- **Weblog**: Orange badge, includes LinkCard preview
- **Devlog**: Green badge, shows description and tags
- **Writing**: Blue badge, shows description and tags

Colors defined in `src/components/TypeBadge.astro`:

- `--color-badge-weblog`: Orange theme
- `--color-badge-devlog`: Green theme
- `--color-badge-writing`: Blue theme
