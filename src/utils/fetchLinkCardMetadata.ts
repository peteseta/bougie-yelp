import { decodeHtmlEntities } from "./decodeHtmlEntities";
import type { LinkCardMetadata } from "./linkcardCache";

async function isValidImageUrl(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    const contentType = response.headers.get("content-type");
    return contentType?.startsWith("image/") ?? false;
  } catch {
    return false;
  }
}

export async function fetchLinkCardMetadata(
  targetUrl: string
): Promise<LinkCardMetadata> {
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
    console.error(`Error fetching ${targetUrl}:`, error);
    return {
      title: new URL(targetUrl).hostname,
      description: "",
      image: "",
      favicon: "/favicon.ico",
      fetchedAt: new Date().toISOString(),
    };
  }
}
