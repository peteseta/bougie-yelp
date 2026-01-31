import type { CollectionEntry } from "astro:content";

export default function getPostType(
  post: CollectionEntry<"blog">,
): "weblog" | "devlog" | "writing" {
  if (post.data.type) return post.data.type;
  if (post.data.description.startsWith("via ")) return "weblog";
  return "writing";
}
