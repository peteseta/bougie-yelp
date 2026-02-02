import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://notbeli.blog/",
  author: "Author",
  profile: "https://github.com/peteseta/",
  desc: "My little corner of the internet",
  title: "BougieYelp",
  ogImage: "og.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  showArchives: true,
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/peteseta",
    linkTitle: ` ${SITE.title} on Github`,
    active: false,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/peteseta",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/peteseta/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:petesetabandhu@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
];
