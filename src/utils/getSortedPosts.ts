import type { CollectionEntry } from "astro:content";
import getEffectiveDate from "./getEffectiveDate";

const getSortedPosts = (posts: CollectionEntry<"blog">[]) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(
          getEffectiveDate(b.data.pubDatetime, b.data.modDatetime).getTime() /
            1000,
        ) -
        Math.floor(
          getEffectiveDate(a.data.pubDatetime, a.data.modDatetime).getTime() /
            1000,
        ),
    );
};

export default getSortedPosts;
