import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import getPostType from "./getPostType";
export type FeedFilter = "all" | "writing" | "weblog" | "devlog";
export const FEED_PAGE_SIZE = 25;
export function getFeedPosts(
  posts: CollectionEntry<"blog">[],
  filter: FeedFilter,
) {
  const sorted = getSortedPosts(posts);
  const selected =
    filter === "all" || filter === "writing"
      ? sorted.filter(
          (post) => getPostType(post) === "writing" && post.data.featured,
        )
      : [];
  const selectedIds = new Set(selected.map((post) => post.id));
  return {
    selected,
    posts: sorted.filter(
      (post) =>
        (filter === "all" || getPostType(post) === filter) &&
        !selectedIds.has(post.id),
    ),
  };
}
export function feedRoute(filter: FeedFilter, page: number) {
  const base = filter === "all" ? "" : `/${filter}`;
  return `${base}${page > 1 ? `/${page}` : ""}/`;
}
