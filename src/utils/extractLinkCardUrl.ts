/**
 * Extract the first LinkCard URL from an MDX post body.
 * Matches: <LinkCard url="..." />
 */
export default function extractLinkCardUrl(body: string): string | null {
  const match = body.match(/<LinkCard\s+url="([^"]+)"\s*\/>/);
  return match?.[1] ?? null;
}
