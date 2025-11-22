# Tina CMS Implementation Plan for BougieYelp

## Overview
This plan details the step-by-step implementation of Tina CMS for the BougieYelp Astro blog. Tina CMS will provide a visual editing interface while maintaining the existing Git-based workflow and MDX file structure.

---

## Why Tina CMS?

### Benefits
- ✅ **Git-based**: Commits directly to your GitHub repository
- ✅ **No migration**: Works with existing MDX files in place
- ✅ **Visual editing**: WYSIWYG editor with live preview
- ✅ **Type-safe**: TypeScript schema validation
- ✅ **Free tier**: Generous free tier for personal sites
- ✅ **MDX support**: Native support for MDX and React components
- ✅ **Local development**: Can test locally without cloud setup

### How It Works
1. You access admin UI at `/admin` route
2. Tina reads/writes MDX files directly from your repo
3. Changes create Git commits automatically
4. Commits trigger your existing Vercel/Cloudflare build
5. Site rebuilds with new content

---

## Prerequisites
- Node.js 18+ installed
- GitHub repository access
- Tina Cloud account (free tier available at https://app.tina.io)

---

## Implementation Phases

### Phase 1: Install Dependencies
**Estimated Time**: 5 minutes

#### Task 1.1: Install Tina CMS packages
```bash
npm install tinacms @tinacms/cli
npm install --save-dev @tinacms/datalayer
```

#### Task 1.2: Verify installation
Check that `package.json` includes:
```json
{
  "dependencies": {
    "tinacms": "^2.3.0",
    "@tinacms/cli": "^1.6.0"
  },
  "devDependencies": {
    "@tinacms/datalayer": "^1.3.0"
  }
}
```

---

### Phase 2: Configure Tina CMS
**Estimated Time**: 30 minutes

#### Task 2.1: Initialize Tina CMS
Run the initialization command:
```bash
npx @tinacms/cli init
```

This creates:
- `/tina/config.ts` - Main Tina configuration
- `.tina` directory for Tina metadata

#### Task 2.2: Create Tina configuration file

**File**: `/tina/config.ts`

```typescript
import { defineConfig } from "tinacms";

// Your hosting provider
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Your GitHub details
  clientId: process.env.TINA_CLIENT_ID || "", // Get from Tina Cloud
  token: process.env.TINA_TOKEN || "", // Get from Tina Cloud

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "src/assets",
      publicFolder: "public",
    },
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
        },

        // Default values for new posts
        defaultItem: () => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');

          return {
            author: "Author",
            pubDatetime: now.toISOString(),
            draft: true,
            featured: false,
            tags: ["others"],
          };
        },

        // Define fields matching your Astro schema
        fields: [
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
            default: "Author",
          },
          {
            type: "datetime",
            name: "pubDatetime",
            label: "Publish Date",
            required: true,
            ui: {
              dateFormat: "YYYY-MM-DDTHH:mm:ssZ",
            },
          },
          {
            type: "datetime",
            name: "modDatetime",
            label: "Modified Date",
            ui: {
              dateFormat: "YYYY-MM-DDTHH:mm:ssZ",
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
              "science",
              "personal",
              "tutorial",
              "review",
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
              // Add more MDX components here as needed
            ],
          },
        ],

        // UI customization
        ui: {
          router: ({ document }) => {
            // Get year and month from the file path
            const pathParts = document._sys.breadcrumbs;
            const year = pathParts[0];
            const month = pathParts[1];
            return `/posts/${document.slug || document._sys.filename}`;
          },
          filename: {
            // Generate filename from title
            slugify: (values) => {
              const date = new Date(values.pubDatetime);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const slug = values.slug || values.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

              return `${year}/${month}/${slug}`;
            },
          },
        },
      },
    ],
  },
});
```

#### Task 2.3: Add Tina scripts to package.json

**File**: `package.json`

Add these scripts:
```json
{
  "scripts": {
    "dev": "tinacms dev -c \"astro dev\"",
    "dev:astro": "astro dev",
    "build": "tinacms build && astro build",
    "tina:build": "tinacms build",
    "tina:dev": "tinacms dev"
  }
}
```

---

### Phase 3: Set Up Admin Route
**Estimated Time**: 15 minutes

#### Task 3.1: Create admin page

**File**: `/src/pages/admin.astro`

```astro
---
// Admin page for Tina CMS
export const prerender = false;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tina CMS Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/admin/index.html"></script>
  </body>
</html>
```

**Note**: The actual admin UI is served by Tina's build output.

#### Task 3.2: Update Astro config for admin route

**File**: `astro.config.ts`

Add to the config:
```typescript
export default defineConfig({
  output: 'hybrid', // Enable hybrid mode for admin route
  // ... existing config
});
```

---

### Phase 4: Set Up Tina Cloud Authentication
**Estimated Time**: 15 minutes

#### Task 4.1: Create Tina Cloud account
1. Go to https://app.tina.io/register
2. Sign up with GitHub
3. Create a new project

#### Task 4.2: Connect GitHub repository
1. In Tina Cloud dashboard, select your repository
2. Configure repository settings:
   - **Repository**: peteseta/bougie-yelp
   - **Branch**: main (or your default branch)

#### Task 4.3: Get API credentials
From the Tina Cloud dashboard:
1. Navigate to project settings
2. Copy **Client ID**
3. Copy **Read-Only Token**

#### Task 4.4: Add environment variables

**File**: `.env` (create if doesn't exist)

```bash
TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here
TINA_BRANCH=main
```

**File**: `.env.example` (for repository)

```bash
TINA_CLIENT_ID=
TINA_TOKEN=
TINA_BRANCH=main
```

#### Task 4.5: Update .gitignore

Ensure `.env` is ignored:
```
.env
.env.local
.tina/__generated__
```

#### Task 4.6: Add environment variables to Vercel/Cloudflare

**For Vercel**:
1. Go to project settings → Environment Variables
2. Add `TINA_CLIENT_ID`
3. Add `TINA_TOKEN`
4. Add `TINA_BRANCH`

**For Cloudflare Pages**:
1. Go to Workers & Pages → Your project → Settings
2. Navigate to Variables and Secrets
3. Add the same environment variables

---

### Phase 5: Configure Media Handling
**Estimated Time**: 10 minutes

#### Task 5.1: Set up media folder structure

Tina will use `/public/uploads` for uploaded images:

```bash
mkdir -p public/uploads
```

#### Task 5.2: Update Tina config for media

Already configured in `tina/config.ts`:
```typescript
media: {
  tina: {
    mediaRoot: "public/uploads",
    publicFolder: "public",
  },
},
```

#### Task 5.3: Configure Git LFS (optional, for large images)

If you plan to upload many large images:
```bash
git lfs install
git lfs track "public/uploads/**"
```

Add to `.gitattributes`:
```
public/uploads/** filter=lfs diff=lfs merge=lfs -text
```

---

### Phase 6: Test Local Development
**Estimated Time**: 20 minutes

#### Task 6.1: Start development server

```bash
npm run dev
```

This should:
1. Start Tina's GraphQL server
2. Start Astro dev server
3. Make admin UI available at http://localhost:4321/admin

#### Task 6.2: Test admin access

1. Navigate to http://localhost:4321/admin
2. You should see Tina CMS login screen
3. Click "Edit Locally" for local development (no auth needed)

#### Task 6.3: Test editing existing post

1. In admin UI, navigate to "Blog Posts"
2. Select an existing post (e.g., "nroottag - Turning any Bluetooth device into an Airtag")
3. Make a small edit to the description
4. Save the changes
5. Verify the MDX file was updated in `src/content/blog/`

#### Task 6.4: Test creating new post

1. Click "Create New" in Blog Posts
2. Fill in required fields:
   - Title
   - Publish Date
   - Description
   - Draft: true
   - Tags
3. Add some content in the body
4. Save
5. Verify new MDX file created in correct `YYYY/MM/` folder

#### Task 6.5: Test preview

1. With a post open in Tina
2. Make changes in the editor
3. Check that changes appear in real-time preview
4. Navigate to the actual Astro dev server to see the post

---

### Phase 7: Production Deployment
**Estimated Time**: 15 minutes

#### Task 7.1: Build and test production build

```bash
npm run build
```

Verify:
- Tina builds successfully
- Astro builds successfully
- Admin UI is included in build output

#### Task 7.2: Deploy to Vercel/Cloudflare

**Automatic Deployment**:
1. Push changes to GitHub
2. Vercel/Cloudflare will detect the changes
3. Build should run with `npm run build`
4. Admin UI should be accessible at `https://your-site.com/admin`

#### Task 7.3: Test production admin

1. Navigate to `https://your-site.com/admin`
2. Log in with Tina Cloud (GitHub OAuth)
3. Verify you can see and edit posts
4. Make a test edit
5. Verify it creates a Git commit
6. Verify the commit triggers a new build

---

### Phase 8: Configure Editorial Workflow
**Estimated Time**: 10 minutes

#### Task 8.1: Set up branch-based workflow (optional)

Update `tina/config.ts` to enable branch-based editing:

```typescript
export default defineConfig({
  // ... existing config

  // Enable editorial workflow
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  // Use feature branches for drafts
  branch: process.env.TINA_BRANCH || "main",

  // ... rest of config
});
```

#### Task 8.2: Create GitHub webhook for rebuild triggers

**For Vercel**:
Automatic - Vercel rebuilds on every commit

**For Cloudflare Pages**:
1. Get build hook URL from Cloudflare dashboard
2. Add to Tina Cloud webhooks
3. Tina will trigger rebuild on every save

---

### Phase 9: Customize Editor Experience
**Estimated Time**: 30 minutes

#### Task 9.1: Add custom MDX component templates

Update `tina/config.ts` to add support for your custom components:

```typescript
// In the blog collection's body field:
{
  type: "rich-text",
  name: "body",
  label: "Content",
  isBody: true,
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
    {
      name: "Callout",
      label: "Callout Box",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "string",
          options: ["info", "warning", "success", "error"],
        },
        {
          name: "content",
          label: "Content",
          type: "rich-text",
        },
      ],
    },
    // Add more custom components as needed
  ],
}
```

#### Task 9.2: Customize tag options

Add common tags to the tags field in `tina/config.ts`:

```typescript
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
}
```

#### Task 9.3: Add custom UI components (advanced)

Create custom field components for enhanced editing:

**File**: `/tina/components/SlugField.tsx`

```tsx
import React from 'react';
import { wrapFieldsWithMeta } from 'tinacms';

export const SlugField = wrapFieldsWithMeta(({ input, meta }) => {
  return (
    <div>
      <label htmlFor={input.name}>Slug</label>
      <input
        type="text"
        id={input.name}
        {...input}
        placeholder="auto-generated-from-title"
      />
      {meta.error && <span className="error">{meta.error}</span>}
    </div>
  );
});
```

---

### Phase 10: Documentation and Training
**Estimated Time**: 15 minutes

#### Task 10.1: Create admin user guide

**File**: `TINA_CMS_USER_GUIDE.md`

```markdown
# Tina CMS User Guide

## Accessing the Admin

1. Go to https://bougie-yelp.vercel.app/admin
2. Log in with your GitHub account
3. You'll see a list of all blog posts

## Creating a New Post

1. Click "Blog Posts" in the sidebar
2. Click "Create New"
3. Fill in the required fields:
   - **Title**: Your post title
   - **Publish Date**: When to publish
   - **Description**: Brief summary for SEO
   - **Tags**: Select relevant tags
   - **Draft**: Check this to hide from published site
4. Write your content in the rich text editor
5. Click "Save"
6. Changes will automatically commit to GitHub and trigger a rebuild

## Editing an Existing Post

1. Click "Blog Posts" in the sidebar
2. Find and click the post you want to edit
3. Make your changes
4. Click "Save"
5. Site will rebuild automatically

## Publishing a Draft

1. Open the draft post
2. Uncheck "Draft"
3. Save
4. Post will appear on the live site after rebuild

## Adding Images

1. In the content editor, click the image icon
2. Upload an image or select from media library
3. Add alt text for accessibility
4. Insert into content

## Using Custom Components

### Link Card
To add a link preview card:
1. Click "+" in the editor
2. Select "Link Card"
3. Enter the URL
4. Save

## Tips

- Changes are saved to GitHub immediately
- Site rebuilds take 2-3 minutes
- Use Draft mode to work on posts without publishing
- Preview shows how the post will look on the site
```

#### Task 10.2: Update main README

Add to `/README.md`:

```markdown
## Content Management

This site uses [Tina CMS](https://tina.io) for content management.

### Editing Content

1. Access the admin at `https://bougie-yelp.vercel.app/admin`
2. Log in with GitHub
3. Edit posts using the visual editor
4. Changes automatically commit to GitHub and trigger rebuilds

### Local Development with Tina

```bash
npm run dev        # Starts Tina + Astro
```

Access admin at `http://localhost:4321/admin`

For more details, see [TINA_CMS_USER_GUIDE.md](./TINA_CMS_USER_GUIDE.md)
```

---

## Testing Checklist

Before considering the implementation complete, verify:

### Local Development
- [ ] `npm run dev` starts Tina + Astro successfully
- [ ] Admin UI accessible at `http://localhost:4321/admin`
- [ ] Can view existing blog posts in Tina
- [ ] Can edit existing post and save changes
- [ ] Changes appear in MDX files
- [ ] Can create new post
- [ ] New post creates proper YYYY/MM folder structure
- [ ] Rich text editor works
- [ ] Preview shows live changes
- [ ] Custom MDX components (LinkCard) work

### Production Build
- [ ] `npm run build` completes successfully
- [ ] Build includes admin UI in output
- [ ] No TypeScript errors
- [ ] No build warnings related to Tina

### Production Deployment
- [ ] Admin UI accessible at production URL `/admin`
- [ ] Can log in with GitHub OAuth
- [ ] Can edit posts in production
- [ ] Edits create Git commits
- [ ] Commits trigger automatic rebuilds
- [ ] Changes appear on live site after rebuild
- [ ] Media uploads work
- [ ] No CORS errors in browser console

### Content Management
- [ ] All existing posts visible in Tina
- [ ] Frontmatter preserved correctly
- [ ] MDX imports preserved
- [ ] Custom components editable
- [ ] Tags work correctly
- [ ] Draft/publish toggle works
- [ ] Featured posts toggle works
- [ ] Dates format correctly

---

## Troubleshooting

### Issue: Admin page shows 404
**Solution**: Ensure Tina build runs before Astro build. Check `npm run build` runs `tinacms build && astro build`.

### Issue: Cannot save changes
**Solution**:
1. Check environment variables are set correctly
2. Verify GitHub permissions in Tina Cloud
3. Check browser console for errors

### Issue: Changes don't trigger rebuild
**Solution**:
1. Verify webhook is configured in Tina Cloud
2. Check deploy platform (Vercel/Cloudflare) has automatic deploys enabled
3. Manually trigger a deploy to test

### Issue: Existing posts not showing
**Solution**:
1. Check `tina/config.ts` path matches `src/content/blog`
2. Verify `match.include` pattern is correct
3. Run `npm run tina:build` to regenerate schema

### Issue: MDX components not rendering
**Solution**:
1. Ensure component templates are defined in `tina/config.ts`
2. Check component imports in MDX files are preserved
3. Verify Astro MDX integration is working

---

## File Changes Summary

### New Files
- `/tina/config.ts` - Tina CMS configuration
- `/src/pages/admin.astro` - Admin page route
- `.env` - Environment variables (local only)
- `.env.example` - Environment variables template
- `TINA_CMS_USER_GUIDE.md` - User documentation

### Modified Files
- `package.json` - Added Tina dependencies and scripts
- `astro.config.ts` - Updated output mode to 'hybrid'
- `.gitignore` - Added Tina-specific ignores
- `README.md` - Added CMS documentation

### Auto-Generated Files (Git-ignored)
- `.tina/__generated__/` - Tina's generated types and schema
- `admin/` - Built admin UI (in build output)

---

## Next Steps After Implementation

1. **Customize the editor**:
   - Add more custom MDX component templates
   - Create custom field components
   - Add validation rules

2. **Enhance workflow**:
   - Set up editorial workflow with review branches
   - Configure automated content reviews
   - Add content scheduling

3. **Optimize experience**:
   - Add keyboard shortcuts
   - Customize the admin UI theme
   - Create post templates

4. **Integrate tools**:
   - Add image optimization
   - Set up SEO analysis
   - Integrate analytics

---

## Cost Estimate

### Tina Cloud Free Tier
- **2 users**
- **2 repositories**
- **Unlimited content**
- **Community support**

### Tina Cloud Pro (if needed)
- **$29/month**
- **Unlimited users**
- **Unlimited repositories**
- **Priority support**
- **Advanced features** (editorial workflow, etc.)

For a personal blog, the **free tier is sufficient**.

---

## Support Resources

- **Tina Documentation**: https://tina.io/docs/
- **Tina Discord**: https://discord.com/invite/zumN63Ybpf
- **Tina GitHub**: https://github.com/tinacms/tinacms
- **Astro + Tina Guide**: https://tina.io/docs/frameworks/astro/

---

## Rollback Plan

If you need to rollback the Tina CMS integration:

1. Remove Tina dependencies:
   ```bash
   npm uninstall tinacms @tinacms/cli @tinacms/datalayer
   ```

2. Remove Tina files:
   ```bash
   rm -rf tina/ .tina/
   rm src/pages/admin.astro
   ```

3. Restore `package.json` scripts to original

4. Restore `astro.config.ts` to original output mode

5. Remove environment variables from hosting platform

Your content files remain unchanged since Tina only reads/writes existing MDX files.

---

## Success Criteria

The implementation is successful when:

1. ✅ You can access the admin UI at `/admin`
2. ✅ You can edit posts visually without touching MDX files
3. ✅ Saves create Git commits automatically
4. ✅ Commits trigger automatic site rebuilds
5. ✅ Changes appear on the live site
6. ✅ The editing experience is intuitive
7. ✅ All existing posts work correctly
8. ✅ New posts can be created easily

**End Goal**: Replace manual MDX editing workflow with visual CMS editing while maintaining full Git history and existing file structure.
