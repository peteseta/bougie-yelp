/** Source links authored as LinkCard components (including older multi-link posts). */
export function extractLinkCardUrls(body: string): string[] {
  return Array.from(
    body.matchAll(/<LinkCard\b[^>]*?\burl=["']([^"']+)["'][^>]*\/>/g),
    (match) => match[1],
  );
}
export default function extractLinkCardUrl(body: string): string | null {
  return extractLinkCardUrls(body)[0] ?? null;
}
