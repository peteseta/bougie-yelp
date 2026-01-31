/**
 * Decode HTML entities in a string.
 * Handles common entities like &amp;, &lt;, &gt;, &quot;, &#39;, and numeric entities.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&ndash;": "\u2013",
    "&mdash;": "\u2014",
    "&lsquo;": "\u2018",
    "&rsquo;": "\u2019",
    "&ldquo;": "\u201C",
    "&rdquo;": "\u201D",
    "&hellip;": "\u2026",
    "&copy;": "\u00A9",
    "&reg;": "\u00AE",
    "&trade;": "\u2122",
  };

  // Replace named entities
  let decoded = text.replace(
    /&(?:amp|lt|gt|quot|apos|nbsp|ndash|mdash|lsquo|rsquo|ldquo|rdquo|hellip|copy|reg|trade|#39);/gi,
    (match) => entities[match.toLowerCase()] || match,
  );

  // Replace numeric entities (decimal)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) =>
    String.fromCharCode(parseInt(num, 10)),
  );

  // Replace numeric entities (hex)
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );

  return decoded;
}
