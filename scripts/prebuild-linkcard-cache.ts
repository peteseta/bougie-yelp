/**
 * Prebuild script to populate linkcard-cache.json and download asset binaries.
 *
 * Scans all MDX files for LinkCard URLs and fetches metadata + downloads
 * images/favicons for any URLs not already in the cache.
 *
 * Flags:
 *   --refresh   Re-process all existing cache entries (re-download assets)
 *
 * Run before build: pnpm prebuild
 * Full refresh:     pnpm prebuild -- --refresh
 *
 * NOTE: Uses relative imports (not @utils/ aliases) because this runs via tsx.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import extractLinkCardUrl from "../src/utils/extractLinkCardUrl";
import { readCache, writeCache } from "../src/utils/linkcardCache";
import { fetchLinkCardMetadata, downloadAsset } from "../src/utils/fetchLinkCardMetadata";
import type { LinkCardMetadata } from "../src/utils/linkcardCache";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "../src/content/blog");
const CONCURRENCY = 8;
const refresh = process.argv.includes("--refresh");

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];
  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  return files;
}

async function pool<T>(
  items: T[],
  n: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (queue.length) await fn(queue.shift()!);
  });
  await Promise.all(workers);
}

async function processUrl(url: string, cache: Record<string, LinkCardMetadata>): Promise<void> {
  console.log(`  Fetching: ${url}`);
  const metadata = await fetchLinkCardMetadata(url);
  cache[url] = metadata;
  console.log(`    -> ${metadata.title || "(no title)"}`);
}

async function refreshEntry(
  url: string,
  entry: LinkCardMetadata,
  cache: Record<string, LinkCardMetadata>,
): Promise<void> {
  console.log(`  Refreshing assets: ${url}`);
  let changed = false;

  if (entry.imageOrigin && !entry.image) {
    const local = await downloadAsset(entry.imageOrigin, "image");
    if (local) { entry.image = local; changed = true; }
  } else if (entry.imageOrigin && entry.image.startsWith("http")) {
    // Legacy entry with origin URL stored as image — re-download
    const local = await downloadAsset(entry.imageOrigin, "image");
    entry.image = local;
    changed = true;
  } else if (!entry.imageOrigin && entry.image.startsWith("http")) {
    // Very old entry: image field holds origin URL, no imageOrigin field
    entry.imageOrigin = entry.image;
    const local = await downloadAsset(entry.imageOrigin, "image");
    entry.image = local;
    changed = true;
  }

  if (entry.faviconOrigin && entry.favicon.startsWith("http")) {
    const local = await downloadAsset(entry.faviconOrigin, "favicon");
    entry.favicon = local || entry.favicon;
    changed = true;
  } else if (!entry.faviconOrigin && entry.favicon.startsWith("http")) {
    entry.faviconOrigin = entry.favicon;
    const local = await downloadAsset(entry.faviconOrigin, "favicon");
    entry.favicon = local || entry.favicon;
    changed = true;
  }

  if (changed) cache[url] = entry;
}

async function main() {
  if (refresh) {
    console.log("--refresh: re-downloading assets for all cached entries...\n");
    const cache = readCache();
    const entries = Object.entries(cache);
    if (entries.length === 0) {
      console.log("Cache is empty.");
      return;
    }
    console.log(`Processing ${entries.length} cached entries...\n`);
    await pool(entries, CONCURRENCY, async ([url, entry]) => {
      await refreshEntry(url, entry, cache);
    });
    writeCache(cache);
    console.log(`\nDone. Processed ${entries.length} entries.`);
    return;
  }

  console.log("Scanning blog posts for LinkCard URLs...\n");

  const mdxFiles = getAllMdxFiles(BLOG_DIR);
  const cache = readCache();
  const urlsToFetch: string[] = [];

  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const url = extractLinkCardUrl(content);
    if (url && !cache[url]) {
      urlsToFetch.push(url);
    }
  }

  if (urlsToFetch.length === 0) {
    console.log("Cache is up to date. No new URLs to fetch.");
    return;
  }

  console.log(`Found ${urlsToFetch.length} new URL(s) to fetch:\n`);

  await pool(urlsToFetch, CONCURRENCY, async (url) => {
    await processUrl(url, cache);
  });

  writeCache(cache);
  console.log(`\nCache updated with ${urlsToFetch.length} new entries.`);
}

main().catch(console.error);
