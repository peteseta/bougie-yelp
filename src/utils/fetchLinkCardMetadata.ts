import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { decodeHtmlEntities } from "./decodeHtmlEntities";
import type { LinkCardMetadata } from "./linkcardCache";

const IMAGE_DIR = path.resolve("public/linkcard-cache/images");
const FAVICON_DIR = path.resolve("public/linkcard-cache/favicons");
const MAX_ASSET_BYTES = 500 * 1024;

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico",
};

function extFromContentType(ct: string): string {
  const base = ct.split(";")[0].trim().toLowerCase();
  return CONTENT_TYPE_EXT[base] ?? ".bin";
}

function extFromUrl(url: string): string {
  try {
    const p = new URL(url).pathname;
    const m = p.match(/\.\w{2,5}$/);
    return m ? m[0].toLowerCase() : "";
  } catch {
    return "";
  }
}

export async function downloadAsset(
  sourceUrl: string,
  kind: "image" | "favicon",
): Promise<string> {
  const dir = kind === "image" ? IMAGE_DIR : FAVICON_DIR;
  fs.mkdirSync(dir, { recursive: true });

  const stem = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 16);

  try {
    const res = await fetch(sourceUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return "";

    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return "";

    const ext = extFromContentType(ct) || extFromUrl(sourceUrl) || ".bin";
    const filePath = path.join(dir, stem + ext);
    const publicPath = `/linkcard-cache/${kind === "image" ? "images" : "favicons"}/${stem}${ext}`;

    if (fs.existsSync(filePath)) return publicPath;

    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_ASSET_BYTES) {
      console.warn(`    Asset too large (${buf.byteLength} bytes), skipping: ${sourceUrl}`);
      return "";
    }

    fs.writeFileSync(filePath, Buffer.from(buf));
    return publicPath;
  } catch {
    return "";
  }
}

async function downloadFaviconWithFallback(
  originUrl: string,
  faviconUrl: string,
): Promise<string> {
  if (faviconUrl) {
    const local = await downloadAsset(faviconUrl, "favicon");
    if (local) return local;
  }
  const host = new URL(originUrl).hostname;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  const local = await downloadAsset(googleFavicon, "favicon");
  return local || "";
}

export async function fetchLinkCardMetadata(
  targetUrl: string,
): Promise<LinkCardMetadata> {
  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
      signal: AbortSignal.timeout(15_000),
    });
    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch =
      html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
      html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i) ||
      html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i);
    const imageMatch =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i) ||
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

    const imageOrigin = getAbsoluteUrl(imageMatch?.[1] || "");
    const faviconOrigin = getAbsoluteUrl(faviconMatch?.[1] || "/favicon.ico");

    const [image, favicon] = await Promise.all([
      imageOrigin ? downloadAsset(imageOrigin, "image") : Promise.resolve(""),
      downloadFaviconWithFallback(targetUrl, faviconOrigin),
    ]);

    return {
      title: decodeHtmlEntities(titleMatch?.[1]?.trim() || ""),
      description: decodeHtmlEntities(descriptionMatch?.[1] || ""),
      image,
      imageOrigin,
      favicon,
      faviconOrigin,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching ${targetUrl}:`, error);
    return {
      title: new URL(targetUrl).hostname,
      description: "",
      image: "",
      imageOrigin: "",
      favicon: "",
      faviconOrigin: "",
      fetchedAt: new Date().toISOString(),
    };
  }
}
