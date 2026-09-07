import type { Site } from "./types";

export const SITE: Site = {
  website: "https://notbeli.blog/",
  author: "Author",
  profile: "https://github.com/peteseta/",
  desc: "My little corner of the internet",
  title: "BougieYelp",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;
