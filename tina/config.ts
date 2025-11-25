import { defineConfig } from "tinacms";

// Your hosting provider - detects git branch from environment
const branch =
  process.env.TINA_BRANCH || // Explicit override
  process.env.CF_PAGES_BRANCH || // Cloudflare Pages
  process.env.GITHUB_BRANCH || // GitHub Actions
  process.env.VERCEL_GIT_COMMIT_REF || // Vercel
  process.env.HEAD || // Generic git
  "main";

export default defineConfig({
  branch,

  // Your GitHub details - get these from Tina Cloud
  // For local development without cloud, these can be undefined
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_READONLY_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  // Enable Tina Cloud Search
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["eng"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  // Content schema matching your existing structure
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blog Posts",
        path: "src/content/blog",
        format: "mdx",

        // Match your existing folder structure: YYYY/MM/slug
        match: {
          include: "**/*",
          exclude: "**/node_modules/**",
        },

        // Default values for new posts
        defaultItem: () => ({
          author: "Author",
          pubDatetime: new Date().toISOString(),
          draft: true,
          featured: false,
          tags: ["others"],
        }),

        // Define fields matching your Astro schema
        fields: [
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "datetime",
            name: "pubDatetime",
            label: "Publish Date",
            required: true,
            description: "Publication date and time for this post",
            ui: {
              dateFormat: "YYYY-MM-DDTHH:mm:ssZ", // ISO format for Astro
              timeFormat: "HH:mm:ss", // 24-hour time picker
            },
          },
          {
            type: "datetime",
            name: "modDatetime",
            label: "Modified Date",
            description: "Last modified date and time",
            ui: {
              dateFormat: "YYYY-MM-DDTHH:mm:ssZ", // ISO format for Astro
              timeFormat: "HH:mm:ss", // 24-hour time picker
            },
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            description: "URL-friendly version of the title",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Post",
            description: "Show on homepage",
          },
          {
            type: "boolean",
            name: "draft",
            label: "Draft",
            description: "Hide from published site",
            required: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
            options: [
              "security",
              "technology",
              "hardware",
              "software",
              "science",
              "personal",
              "tutorial",
              "review",
              "analysis",
              "news",
              "others",
            ],
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "ogImage",
            label: "OG Image",
            description: "Social sharing image (min 1200x630px)",
          },
          {
            type: "string",
            name: "canonicalURL",
            label: "Canonical URL",
            description: "Original URL if republished content",
          },
          {
            type: "object",
            name: "editPost",
            label: "Edit Post Settings",
            fields: [
              {
                type: "boolean",
                name: "disabled",
                label: "Disable Edit Link",
              },
              {
                type: "string",
                name: "url",
                label: "Edit URL",
              },
              {
                type: "string",
                name: "text",
                label: "Edit Link Text",
              },
              {
                type: "boolean",
                name: "appendFilePath",
                label: "Append File Path",
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Content",
            isBody: true,

            // Enable MDX components
            templates: [
              {
                name: "LinkCard",
                label: "Link Card",
                fields: [
                  {
                    name: "url",
                    label: "URL",
                    type: "string",
                    required: true,
                  },
                ],
              },
            ],
          },
        ],

        // UI customization
        ui: {
          // Removed router to use default form editor
          // Router is for visual editing which requires React components

          filename: {
            // Generate filename from title and date: YYYY/MM/slug
            slugify: (values) => {
              const date = new Date(values.pubDatetime || new Date());
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const slug =
                values.slug ||
                values.title
                  ?.toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "");

              return `${year}/${month}/${slug}`;
            },
          },
        },
      },
    ],
  },
});
