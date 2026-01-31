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
  metadata: LinkCardMetadata,
): void {
  const cache = readCache();
  cache[url] = metadata;
  writeCache(cache);
}
