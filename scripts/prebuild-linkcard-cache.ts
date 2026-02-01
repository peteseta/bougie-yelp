/**
 * Prebuild script to populate linkcard-cache.json
 *
 * Scans all MDX files for LinkCard URLs and fetches metadata
 * for any URLs not already in the cache.
 *
 * Run before build: pnpm prebuild
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.resolve(ROOT, "src/content/blog");
const CACHE_PATH = path.resolve(ROOT, "src/data/linkcard-cache.json");

interface LinkCardMetadata {
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

function extractLinkCardUrl(body: string): string | null {
  const match = body.match(/<LinkCard\s+url="([^"]+)"\s*\/>/);
  return match?.[1] ?? null;
}

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

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

async function isValidImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return contentType?.startsWith("image/") ?? false;
  } catch {
    return false;
  }
}

async function fetchMetadata(targetUrl: string): Promise<LinkCardMetadata> {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
    });
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch =
      html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i) ||
      html.match(
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
      );
    const imageMatch =
      html.match(
        /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i,
      ) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"[^>]*>/i);
    const faviconMatch =
      html.match(/<link[^>]*rel="icon"[^>]*href="([^"]*)"[^>]*>/i) ||
      html.match(/<link[^>]*href="([^"]*)"[^>]*rel="icon"[^>]*>/i);

    const baseUrl = new URL(targetUrl);
    const getAbsoluteUrl = (relativeUrl: string): string => {
      if (!relativeUrl) return "";
      try {
        return new URL(relativeUrl, baseUrl).toString();
      } catch {
        return relativeUrl;
      }
    };

    const imageUrl = getAbsoluteUrl(imageMatch?.[1] || "");
    const hasValidImage = imageUrl ? await isValidImageUrl(imageUrl) : false;

    return {
      title: decodeHtmlEntities(titleMatch?.[1]?.trim() || ""),
      description: decodeHtmlEntities(descriptionMatch?.[1] || ""),
      image: hasValidImage ? imageUrl : "",
      favicon: getAbsoluteUrl(faviconMatch?.[1] || "/favicon.ico"),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`  Error fetching ${targetUrl}:`, error);
    return {
      title: new URL(targetUrl).hostname,
      description: "",
      image: "",
      favicon: "/favicon.ico",
      fetchedAt: new Date().toISOString(),
    };
  }
}

async function main() {
  console.log("Scanning blog posts for LinkCard URLs...\n");

  const mdxFiles = getAllMdxFiles(BLOG_DIR);
  const cache = readCache();
  const urlsToFetch: string[] = [];

  // Extract all LinkCard URLs
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

  // Fetch metadata for new URLs
  for (const url of urlsToFetch) {
    console.log(`  Fetching: ${url}`);
    const metadata = await fetchMetadata(url);
    cache[url] = metadata;
    console.log(`    -> ${metadata.title || "(no title)"}`);
  }

  writeCache(cache);
  console.log(`\nCache updated with ${urlsToFetch.length} new entries.`);
}

main().catch(console.error);
