# Homepage & Feed Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the homepage into a two-column layout with a content type system (weblog/devlog/writing), rich feed cards with inline LinkCards, a sidebar with currently reading/listening (Spotify) and tag cloud, and a build-time LinkCard metadata cache.

**Architecture:** Add a `type` field to the blog schema with auto-detection for weblogs. Replace the current single-column post list and marquee with a two-column layout: main feed (left, ~2/3) with filter buttons and rich cards, sticky sidebar (right, ~1/3) with currently reading, currently listening (Spotify API), and tag cloud. LinkCard metadata is cached in a committed JSON file to avoid repeated fetches at build time.

**Tech Stack:** Astro 5, Tailwind CSS 3, React 18, Spotify Web API (client credentials flow), Zod

---

### Task 1: Add `type` Field to Blog Schema

**Files:**
- Modify: `src/content/config.ts:9-33` (add `type` to schema)

**Step 1: Modify the Zod schema to include `type`**

In `src/content/config.ts`, add `type` field to the schema object. It should be optional with auto-detection at runtime:

```typescript
// Add after the `author` field (line 10):
type: z.enum(["weblog", "devlog", "writing"]).optional(),
```

**Step 2: Create the type detection utility**

Create `src/utils/getPostType.ts`:

```typescript
import type { CollectionEntry } from "astro:content";

export default function getPostType(
  post: CollectionEntry<"blog">
): "weblog" | "devlog" | "writing" {
  if (post.data.type) return post.data.type;
  if (post.data.description.startsWith("via ")) return "weblog";
  return "writing";
}
```

**Step 3: Verify the build still passes**

Run: `pnpm build`
Expected: Build succeeds with no schema errors (existing posts have no `type` field, and it's optional)

**Step 4: Commit**

```bash
git add src/content/config.ts src/utils/getPostType.ts
git commit -m "feat: add content type field to blog schema with auto-detection"
```

---

### Task 2: Create Type Badge Component

**Files:**
- Create: `src/components/TypeBadge.astro`
- Modify: `src/styles/base.css` (add badge color CSS variables)

**Step 1: Add CSS variables for badge colors**

In `src/styles/base.css`, add badge color variables to both theme blocks:

```css
/* In :root / light theme (after --color-border line 14): */
--color-badge-weblog: 140, 140, 140;      /* muted gray */
--color-badge-devlog: 0, 108, 172;         /* matches accent */
--color-badge-writing: 139, 92, 246;       /* purple */

/* In dark theme (after --color-border line 24): */
--color-badge-weblog: 120, 120, 120;       /* muted gray */
--color-badge-devlog: 121, 184, 255;       /* matches accent */
--color-badge-writing: 167, 139, 250;      /* purple */
```

**Step 2: Create the TypeBadge component**

Create `src/components/TypeBadge.astro`:

```astro
---
interface Props {
  type: "weblog" | "devlog" | "writing";
}

const { type } = Astro.props;

const colorMap = {
  weblog: "badge-weblog",
  devlog: "badge-devlog",
  writing: "badge-writing",
};
---

<span
  class:list={[
    "inline-block rounded border px-1.5 py-0.5 text-xs font-medium leading-tight",
    colorMap[type],
  ]}
>
  {type}
</span>

<style>
  .badge-weblog {
    color: rgb(var(--color-badge-weblog));
    border-color: rgb(var(--color-badge-weblog) / 0.4);
    background-color: rgb(var(--color-badge-weblog) / 0.08);
  }
  .badge-devlog {
    color: rgb(var(--color-badge-devlog));
    border-color: rgb(var(--color-badge-devlog) / 0.4);
    background-color: rgb(var(--color-badge-devlog) / 0.08);
  }
  .badge-writing {
    color: rgb(var(--color-badge-writing));
    border-color: rgb(var(--color-badge-writing) / 0.4);
    background-color: rgb(var(--color-badge-writing) / 0.08);
  }
</style>
```

**Step 3: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/TypeBadge.astro src/styles/base.css
git commit -m "feat: add TypeBadge component with themed colors"
```

---

### Task 3: Build the LinkCard Metadata Cache System

**Files:**
- Create: `src/utils/linkcardCache.ts`
- Create: `src/data/linkcard-cache.json` (empty initial cache)
- Modify: `src/components/LinkCard.astro:18-68` (use cache)

**Step 1: Create the empty cache file**

Create `src/data/linkcard-cache.json`:

```json
{}
```

**Step 2: Create the cache utility**

Create `src/utils/linkcardCache.ts`:

```typescript
import fs from "node:fs";
import path from "node:path";

const CACHE_PATH = path.resolve("src/data/linkcard-cache.json");

export interface LinkCardMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  fetchedAt: string;
}

type CacheData = Record<string, LinkCardMetadata>;

function readCache(): CacheData {
  try {
    const raw = fs.readFileSync(CACHE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeCache(data: CacheData): void {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export function getCachedMetadata(url: string): LinkCardMetadata | null {
  const cache = readCache();
  return cache[url] ?? null;
}

export function setCachedMetadata(
  url: string,
  metadata: LinkCardMetadata
): void {
  const cache = readCache();
  cache[url] = metadata;
  writeCache(cache);
}
```

**Step 3: Update LinkCard.astro to use the cache**

Replace the `fetchMetadata` function and call site in `src/components/LinkCard.astro`. The frontmatter section (lines 1-71) should become:

```astro
---
import {
  getCachedMetadata,
  setCachedMetadata,
  type LinkCardMetadata,
} from "@utils/linkcardCache";

interface Props {
  url: string;
}

const { url } = Astro.props;

async function isValidImageUrl(imageUrl: string) {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return contentType?.startsWith("image/");
  } catch {
    return false;
  }
}

async function fetchAndCacheMetadata(
  targetUrl: string
): Promise<LinkCardMetadata> {
  const cached = getCachedMetadata(targetUrl);
  if (cached) return cached;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
    });
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch =
      html.match(
        /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i
      ) ||
      html.match(
        /<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i
      ) ||
      html.match(
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i
      );
    const imageMatch =
      html.match(
        /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i
      ) ||
      html.match(
        /<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i
      );
    const faviconMatch =
      html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i) ||
      html.match(/<link[^>]*href="([^"]*)"[^>]*rel="icon"[^>]*>/i);

    const baseUrl = new URL(targetUrl);
    const getAbsoluteUrl = (relativeUrl: string) => {
      if (!relativeUrl) return "";
      try {
        return new URL(relativeUrl, baseUrl).toString();
      } catch {
        return relativeUrl;
      }
    };

    const imageUrl = getAbsoluteUrl(imageMatch?.[1] || "");
    const hasValidImage = imageUrl ? await isValidImageUrl(imageUrl) : false;

    const metadata: LinkCardMetadata = {
      title: titleMatch?.[1] || "",
      description: descriptionMatch?.[1] || "",
      image: hasValidImage ? imageUrl : "",
      favicon: getAbsoluteUrl(faviconMatch?.[1] || "/favicon.ico"),
      fetchedAt: new Date().toISOString(),
    };

    setCachedMetadata(targetUrl, metadata);
    return metadata;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    const fallback: LinkCardMetadata = {
      title: new URL(targetUrl).hostname,
      description: "",
      image: "",
      favicon: "/favicon.ico",
      fetchedAt: new Date().toISOString(),
    };
    setCachedMetadata(targetUrl, fallback);
    return fallback;
  }
}

const metadata = await fetchAndCacheMetadata(url);
---
```

The template section (lines 73-118) stays **unchanged**.

**Step 4: Run a build to populate the cache**

Run: `pnpm build`
Expected: Build succeeds. `src/data/linkcard-cache.json` is now populated with metadata for all existing LinkCard URLs.

**Step 5: Commit**

```bash
git add src/utils/linkcardCache.ts src/data/linkcard-cache.json src/components/LinkCard.astro
git commit -m "feat: add build-time LinkCard metadata cache"
```

---

### Task 4: Create Feed-Inline LinkCard Component

The homepage feed needs a compact version of LinkCard that reads from cache (no fetching) and works inline in feed cards.

**Files:**
- Create: `src/components/FeedLinkCard.astro`

**Step 1: Create a utility to extract LinkCard URL from post body**

Create `src/utils/extractLinkCardUrl.ts`:

```typescript
/**
 * Extract the first LinkCard URL from an MDX post body.
 * Matches: <LinkCard url="..." />
 */
export default function extractLinkCardUrl(body: string): string | null {
  const match = body.match(/<LinkCard\s+url="([^"]+)"\s*\/>/);
  return match?.[1] ?? null;
}
```

**Step 2: Create FeedLinkCard component**

Create `src/components/FeedLinkCard.astro`:

```astro
---
import { getCachedMetadata } from "@utils/linkcardCache";

interface Props {
  url: string;
}

const { url } = Astro.props;
const metadata = getCachedMetadata(url);
const displayTitle = metadata?.title || new URL(url).hostname;
const displayDescription = metadata?.description || "";
const displayFavicon = metadata?.favicon || "/favicon.ico";
const displayImage = metadata?.image || "";
---

<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  class="group block rounded border border-skin-line bg-skin-card/50 px-4 py-3 transition-[border-color] hover:border-skin-accent"
>
  <div class="flex gap-4">
    {displayImage && (
      <div class="hidden flex-shrink-0 self-start sm:block">
        <img
          src={displayImage}
          alt=""
          class="h-20 w-20 rounded border border-skin-line object-cover"
        />
      </div>
    )}
    <div class="min-w-0 flex-grow">
      <h4 class="break-words text-sm font-medium text-skin-accent decoration-dashed group-hover:underline">
        {displayTitle}
      </h4>
      {displayDescription && (
        <p class="mt-1 break-words text-xs text-skin-base opacity-75 line-clamp-2">
          {displayDescription}
        </p>
      )}
      <div class="mt-1.5 flex items-center gap-1.5 text-xs text-skin-base opacity-60">
        {displayFavicon && (
          <img
            src={displayFavicon}
            alt=""
            class="h-3 w-3"
            onerror="this.style.display='none'"
          />
        )}
        <span class="truncate">{new URL(url).hostname}</span>
        <span>↗</span>
      </div>
    </div>
  </div>
</a>
```

**Step 3: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/FeedLinkCard.astro src/utils/extractLinkCardUrl.ts
git commit -m "feat: add FeedLinkCard and URL extraction for homepage feed"
```

---

### Task 5: Create Feed Card Components

**Files:**
- Create: `src/components/WeblogCard.astro`
- Create: `src/components/PostCard.astro` (devlog/writing)
- Create: `src/components/FeedCard.astro` (dispatcher)

**Step 1: Create WeblogCard component**

Create `src/components/WeblogCard.astro`:

```astro
---
import TypeBadge from "./TypeBadge.astro";
import FeedLinkCard from "./FeedLinkCard.astro";
import type { CollectionEntry } from "astro:content";

interface Props {
  post: CollectionEntry<"blog">;
  linkUrl: string | null;
}

const { post, linkUrl } = Astro.props;
const { title, pubDatetime } = post.data;

const displayDate = new Date(pubDatetime).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
---

<article class="py-4">
  <div class="mb-2 flex items-center gap-2 text-sm">
    <TypeBadge type="weblog" />
    <time datetime={pubDatetime.toISOString()} class="text-skin-base opacity-60">
      {displayDate}
    </time>
  </div>
  <h3 class="mb-2">
    <a
      href={`/posts/${post.id}/`}
      class="text-base font-medium text-skin-base decoration-dashed underline-offset-4 hover:text-skin-accent hover:underline"
    >
      {title}
    </a>
  </h3>
  {linkUrl && <FeedLinkCard url={linkUrl} />}
</article>
```

**Step 2: Create PostCard component (for devlog/writing)**

Create `src/components/PostCard.astro`:

```astro
---
import TypeBadge from "./TypeBadge.astro";
import Tag from "./Tag.astro";
import type { CollectionEntry } from "astro:content";

interface Props {
  post: CollectionEntry<"blog">;
  type: "devlog" | "writing";
}

const { post, type } = Astro.props;
const { title, pubDatetime, description, tags } = post.data;

const displayDate = new Date(pubDatetime).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// Rough reading time: ~200 words per minute
const body = await post.render().then(r => r.remarkPluginFrontmatter?.readingTime);
// We don't have reading time plugin, so estimate from description length
// This is a placeholder — reading time can be added later via remark plugin
---

<article class="py-4">
  <div class="mb-2 flex items-center gap-2 text-sm">
    <TypeBadge type={type} />
    <time datetime={pubDatetime.toISOString()} class="text-skin-base opacity-60">
      {displayDate}
    </time>
  </div>
  <h3 class="mb-1">
    <a
      href={`/posts/${post.id}/`}
      class="text-lg font-semibold text-skin-base decoration-dashed underline-offset-4 hover:text-skin-accent hover:underline"
    >
      {title}
    </a>
  </h3>
  <p class="mb-2 text-sm text-skin-base opacity-80 line-clamp-3">
    {description}
  </p>
  {tags.length > 0 && (
    <div class="flex flex-wrap gap-1">
      {tags.map(tag => (
        <Tag tag={tag} size="sm" />
      ))}
    </div>
  )}
</article>
```

**Step 3: Create FeedCard dispatcher**

Create `src/components/FeedCard.astro`:

```astro
---
import WeblogCard from "./WeblogCard.astro";
import PostCard from "./PostCard.astro";
import getPostType from "@utils/getPostType";
import extractLinkCardUrl from "@utils/extractLinkCardUrl";
import type { CollectionEntry } from "astro:content";

interface Props {
  post: CollectionEntry<"blog">;
}

const { post } = Astro.props;
const type = getPostType(post);

// For weblogs, extract the LinkCard URL from the post body
let linkUrl: string | null = null;
if (type === "weblog") {
  linkUrl = extractLinkCardUrl(post.body ?? "");
}
---

{type === "weblog" ? (
  <WeblogCard post={post} linkUrl={linkUrl} />
) : (
  <PostCard post={post} type={type} />
)}
```

**Step 4: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/WeblogCard.astro src/components/PostCard.astro src/components/FeedCard.astro
git commit -m "feat: add feed card components for weblog and devlog/writing types"
```

---

### Task 6: Set Up Spotify Integration

**Files:**
- Create: `src/utils/spotify.ts`
- Modify: `src/data/currently.json` (replace `listening` array with playlist ID)
- Modify: `.env.example` (add Spotify vars)

**Step 1: Update `.env.example` with Spotify credentials**

Add to `.env.example`:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

**Step 2: Update `currently.json` to use playlist ID**

Replace `src/data/currently.json`:

```json
{
  "reading": [
    {
      "title": "Liberation Day",
      "author": "George Saunders"
    },
    {
      "title": "Why We Sleep",
      "author": "Matthew Walker"
    }
  ],
  "listening": {
    "spotifyPlaylistId": "REPLACE_WITH_PLAYLIST_ID"
  }
}
```

**Step 3: Create Spotify utility**

Create `src/utils/spotify.ts`:

```typescript
interface SpotifyTrack {
  title: string;
  artist: string;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyPlaylistResponse {
  items: Array<{
    track: {
      name: string;
      artists: Array<{ name: string }>;
    } | null;
  }>;
}

async function getAccessToken(): Promise<string> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data: SpotifyTokenResponse = await response.json();
  return data.access_token;
}

export async function getPlaylistTracks(
  playlistId: string,
  limit = 5
): Promise<SpotifyTrack[]> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&fields=items(track(name,artists(name)))`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data: SpotifyPlaylistResponse = await response.json();
    return data.items
      .filter(item => item.track !== null)
      .map(item => ({
        title: item.track!.name,
        artist: item.track!.artists.map(a => a.name).join(", "),
      }));
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    return [];
  }
}
```

**Step 4: Verify the module compiles**

Run: `pnpm build`
Expected: Build succeeds (Spotify is not called yet — just the module is compiled)

**Step 5: Commit**

```bash
git add src/utils/spotify.ts src/data/currently.json .env.example
git commit -m "feat: add Spotify playlist integration utility"
```

---

### Task 7: Build the Sidebar Component

**Files:**
- Create: `src/components/Sidebar.astro`

**Step 1: Create the Sidebar component**

Create `src/components/Sidebar.astro`:

```astro
---
import { getCollection } from "astro:content";
import Tag from "./Tag.astro";
import getUniqueTags from "@utils/getUniqueTags";
import postFilter from "@utils/postFilter";
import { getPlaylistTracks } from "@utils/spotify";
import currentlyData from "@data/currently.json";

// Currently Reading
const reading = currentlyData.reading;

// Currently Listening (Spotify)
let tracks: { title: string; artist: string }[] = [];
const playlistId = currentlyData.listening?.spotifyPlaylistId;
if (playlistId && playlistId !== "REPLACE_WITH_PLAYLIST_ID") {
  tracks = await getPlaylistTracks(playlistId);
}

// Tags with post counts
const posts = await getCollection("blog");
const filteredPosts = posts.filter(postFilter);

const tagCounts = new Map<string, { tagName: string; count: number }>();
for (const post of filteredPosts) {
  for (const tag of post.data.tags) {
    const existing = tagCounts.get(tag);
    if (existing) {
      existing.count++;
    } else {
      tagCounts.set(tag, { tagName: tag, count: 1 });
    }
  }
}

const sortedTags = [...tagCounts.entries()]
  .sort((a, b) => b[1].count - a[1].count)
  .map(([tag, { tagName, count }]) => ({ tag, tagName, count }));
---

<aside class="sidebar">
  {/* Currently Reading */}
  {reading.length > 0 && (
    <section class="mb-8">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-skin-base opacity-60">
        Reading
      </h3>
      <ul class="space-y-2">
        {reading.map(book => (
          <li class="text-sm">
            <span class="text-skin-base">{book.title}</span>
            <span class="text-skin-base opacity-50"> — {book.author}</span>
          </li>
        ))}
      </ul>
    </section>
  )}

  {/* Currently Listening */}
  {tracks.length > 0 && (
    <section class="mb-8">
      <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-skin-base opacity-60">
        Listening
      </h3>
      <ul class="space-y-2">
        {tracks.map(track => (
          <li class="text-sm">
            <span class="text-skin-base">{track.title}</span>
            <span class="text-skin-base opacity-50"> — {track.artist}</span>
          </li>
        ))}
      </ul>
    </section>
  )}

  {/* Topics */}
  <section>
    <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-skin-base opacity-60">
      Topics
    </h3>
    <div class="flex flex-wrap gap-1.5">
      {sortedTags.map(({ tag, count }) => (
        <a
          href={`/tags/${tag}/`}
          class="inline-block rounded border border-skin-line px-2 py-1 text-xs text-skin-base transition-colors hover:border-skin-accent hover:text-skin-accent"
        >
          {tag}
          <span class="ml-0.5 opacity-50">{count}</span>
        </a>
      ))}
    </div>
  </section>
</aside>

<style>
  .sidebar {
    position: sticky;
    top: 4rem;
    max-height: calc(100vh - 5rem);
    overflow-y: auto;
  }
</style>
```

**Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds (Spotify won't fetch without valid credentials — it falls back to empty array)

**Step 3: Commit**

```bash
git add src/components/Sidebar.astro
git commit -m "feat: add sidebar with reading, listening, and topics"
```

---

### Task 8: Create Filter Buttons Component

**Files:**
- Create: `src/components/FeedFilter.astro`

**Step 1: Create the filter buttons component**

This uses client-side JS to filter feed items by `data-type` attribute.

Create `src/components/FeedFilter.astro`:

```astro
---
// No props needed — purely client-side filtering
---

<div class="feed-filter mb-6 flex flex-wrap gap-2">
  <button class="filter-btn active" data-filter="all">All</button>
  <button class="filter-btn" data-filter="weblog">Weblogs</button>
  <button class="filter-btn" data-filter="devlog">Devlogs</button>
  <button class="filter-btn" data-filter="writing">Writings</button>
</div>

<style>
  .filter-btn {
    @apply rounded border border-skin-line px-3 py-1 text-sm text-skin-base transition-colors;
  }
  .filter-btn:hover {
    @apply border-skin-accent text-skin-accent;
  }
  .filter-btn.active {
    @apply border-skin-accent bg-skin-accent/10 text-skin-accent;
  }
</style>

<script>
  function initFilter() {
    const buttons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
    const feedItems =
      document.querySelectorAll<HTMLElement>("[data-post-type]");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter!;

        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        feedItems.forEach(item => {
          if (filter === "all" || item.dataset.postType === filter) {
            item.style.display = "";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // Run on initial load and after Astro view transitions
  initFilter();
  document.addEventListener("astro:after-swap", initFilter);
</script>
```

**Step 2: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/FeedFilter.astro
git commit -m "feat: add client-side feed filter buttons"
```

---

### Task 9: Rewrite the Homepage

This is the main integration task. Replace the current homepage with the two-column layout.

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)

**Step 1: Rewrite `src/pages/index.astro`**

Replace the entire file with:

```astro
---
import { getCollection } from "astro:content";
import Layout from "@layouts/Layout.astro";
import Header from "@components/Header.astro";
import Footer from "@components/Footer.astro";
import Socials from "@components/Socials.astro";
import FeedCard from "@components/FeedCard.astro";
import FeedFilter from "@components/FeedFilter.astro";
import Sidebar from "@components/Sidebar.astro";
import getSortedPosts from "@utils/getSortedPosts";
import getPostType from "@utils/getPostType";
import { SITE, SOCIALS } from "@config";

const posts = await getCollection("blog");
const sortedPosts = getSortedPosts(posts);
const socialCount = SOCIALS.filter(social => social.active).length;
---

<Layout>
  <Header />
  <main id="main-content">
    <section id="hero">
      <h1>Everything I (never) posted to Beli.</h1>
      <a
        target="_blank"
        href="/rss.xml"
        class="rss-link"
        aria-label="rss feed"
        title="RSS Feed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="rss-icon">
          <path d="M19 20.001C19 11.729 12.271 5 4 5v2c7.168 0 13 5.832 13 13.001h2z" />
          <path d="M12 20.001h2C14 14.486 9.514 10 4 10v2c4.411 0 8 3.589 8 8.001z" />
          <circle cx="6" cy="18" r="2" />
        </svg>
        <span class="sr-only">RSS Feed</span>
      </a>
      {socialCount > 0 && (
        <div class="social-wrapper">
          <Socials />
        </div>
      )}
    </section>

    <div class="two-col">
      <div class="feed-col">
        <FeedFilter />
        <div class="feed-list">
          {sortedPosts.map(post => (
            <div
              data-post-type={getPostType(post)}
              class="border-b border-skin-line last:border-b-0"
            >
              <FeedCard post={post} />
            </div>
          ))}
        </div>
      </div>
      <div class="sidebar-col">
        <Sidebar />
      </div>
    </div>
  </main>

  <Footer />
</Layout>

<style>
  /* ===== Hero Section ===== */
  #hero {
    @apply mx-auto max-w-5xl px-4 pb-6 pt-8;
  }
  #hero h1 {
    @apply my-4 inline-block text-3xl font-bold sm:my-8 sm:text-5xl;
  }
  #hero .rss-link {
    @apply mb-6;
  }
  #hero .rss-icon {
    @apply mb-2 h-6 w-6 scale-110 fill-skin-accent sm:mb-3 sm:scale-125;
  }
  .social-wrapper {
    @apply mt-4 flex flex-col sm:flex-row sm:items-center;
  }

  /* ===== Two-Column Layout ===== */
  .two-col {
    @apply mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-12 lg:flex-row;
  }
  .feed-col {
    @apply min-w-0 lg:w-2/3;
  }
  .sidebar-col {
    @apply lg:w-1/3;
  }
</style>
```

**Step 2: Update `base.css` section/footer max-width override**

The current `base.css` constrains `section, footer` to `max-w-3xl`. The new layout needs wider width at the page level. In `src/styles/base.css`, change:

```css
/* line 37-39: */
  section,
  footer {
    @apply mx-auto max-w-3xl px-4;
  }
```

to:

```css
  section,
  footer {
    @apply mx-auto max-w-5xl px-4;
  }
```

> **Note:** This widens the max-width globally. Other pages (posts, tags) use the `Main` layout which sets its own max-width, so they won't be affected visually. Verify this in Step 3.

**Step 3: Run the dev server and visually verify**

Run: `pnpm dev`
Expected: Homepage shows hero (no placeholder text), two-column layout on desktop, single column on mobile. Feed cards show type badges. Sidebar shows reading list and topics grid. Filter buttons work.

**Step 4: Verify full build passes**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add src/pages/index.astro src/styles/base.css
git commit -m "feat: redesign homepage with two-column layout and rich feed"
```

---

### Task 10: Remove the Marquee / CurrentlySection from Homepage

The marquee is replaced by the sidebar. The component file can stay (in case it's used elsewhere), but remove the import and usage from the homepage.

**Files:**
- Verify: `src/pages/index.astro` (already removed in Task 9)
- Check: No other files import `CurrentlySection.astro`

**Step 1: Verify CurrentlySection is only used on homepage**

Run: `grep -r "CurrentlySection" src/`
Expected: Only the old homepage import (now removed). If found elsewhere, leave the component file. If not found anywhere, delete it.

**Step 2: Delete the component if unused**

```bash
rm src/components/CurrentlySection.astro
```

**Step 3: Verify build passes**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused CurrentlySection marquee component"
```

---

### Task 11: Verify All Existing Pages Still Work

**Files:** None modified — this is a verification task.

**Step 1: Build the full site**

Run: `pnpm build`
Expected: Clean build, no errors

**Step 2: Preview and check key pages**

Run: `pnpm preview`

Check:
- Homepage (`/`) — two-column layout, filter buttons, feed cards, sidebar
- Individual post (`/posts/chile-salmon-farms/`) — renders normally with LinkCard
- Posts list (`/posts/`) — renders normally with existing Card component
- Tags index (`/tags/`) — renders normally
- Tag detail (`/tags/technology/`) — renders normally
- Search — still works

**Step 3: Verify mobile responsiveness**

Using browser devtools, check that at mobile widths:
- Homepage collapses to single column
- Sidebar stacks below feed
- Feed cards are readable
- Filter buttons wrap properly

**Step 4: Commit any fixes if needed**

If any issues found, fix and commit with descriptive messages.

---

### Task 12: Final Cleanup and Polish

**Files:** Various — depends on issues found in Task 11.

**Step 1: Check for any TypeScript errors**

Run: `pnpm astro check` (if available) or `npx tsc --noEmit`
Expected: No type errors

**Step 2: Remove any dead imports or unused code introduced during the redesign**

Scan modified files for unused imports.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup for homepage redesign"
```

---

## Dependency Graph

```
Task 1 (schema) ← Task 2 (badges)
Task 1 (schema) ← Task 5 (feed cards)
Task 3 (cache) ← Task 4 (FeedLinkCard)
Task 4 (FeedLinkCard) ← Task 5 (feed cards)
Task 2 (badges) ← Task 5 (feed cards)
Task 5 (feed cards) ← Task 9 (homepage)
Task 6 (Spotify) ← Task 7 (sidebar)
Task 7 (sidebar) ← Task 9 (homepage)
Task 8 (filter) ← Task 9 (homepage)
Task 9 (homepage) ← Task 10 (remove marquee)
Task 10 ← Task 11 (verify)
Task 11 ← Task 12 (cleanup)
```

Tasks 1-2 can be parallelized with Tasks 3-4 and Task 6.
Tasks 5, 7, 8 depend on their respective prerequisites but are independent of each other.
Task 9 brings everything together.
