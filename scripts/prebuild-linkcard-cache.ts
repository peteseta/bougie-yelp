/**
 * Prebuild script to populate linkcard-cache.json
 *
 * Scans all MDX files for LinkCard URLs and fetches metadata
 * for any URLs not already in the cache.
 *
 * Run before build: pnpm prebuild
 *
 * NOTE: This script runs via `npx tsx`, not Astro, so it uses
 * relative imports instead of @utils/ aliases.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import extractLinkCardUrl from "../src/utils/extractLinkCardUrl";
import { readCache, writeCache } from "../src/utils/linkcardCache";
import { fetchLinkCardMetadata } from "../src/utils/fetchLinkCardMetadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, "../src/content/blog");

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

async function main() {
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

  for (const url of urlsToFetch) {
    console.log(`  Fetching: ${url}`);
    const metadata = await fetchLinkCardMetadata(url);
    cache[url] = metadata;
    console.log(`    -> ${metadata.title || "(no title)"}`);
  }

  writeCache(cache);
  console.log(`\nCache updated with ${urlsToFetch.length} new entries.`);
}

main().catch(console.error);
