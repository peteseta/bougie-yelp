# Tina CMS User Guide

## Accessing the Admin

1. Go to your site's `/admin` route (e.g., `https://your-site.com/admin`)
2. Log in with your GitHub account (production) or click "Edit Locally" (local development)
3. You'll see a list of all blog posts

## Creating a New Post

1. Click "Blog Posts" in the sidebar
2. Click "Create New"
3. Fill in the required fields:
   - **Title**: Your post title
   - **Publish Date**: When to publish (defaults to now)
   - **Author**: Your name (defaults to "Author")
   - **Description**: Brief summary for SEO and social sharing
   - **Tags**: Select relevant tags from the dropdown
   - **Draft**: Check this to hide from published site
   - **Featured**: Check this to show on homepage
4. Write your content in the rich text editor
5. Click "Save"
6. Changes will automatically commit to GitHub and trigger a rebuild

## Editing an Existing Post

1. Click "Blog Posts" in the sidebar
2. Find and click the post you want to edit
3. Make your changes in the editor
4. Click "Save"
5. Site will rebuild automatically (takes 2-3 minutes)

## Publishing a Draft

1. Open the draft post
2. Uncheck "Draft"
3. Save
4. Post will appear on the live site after the rebuild completes

## Adding Images

1. In the content editor, click the image icon
2. Upload an image or select from media library
3. Add alt text for accessibility
4. Insert into content
5. Images are stored in `/public/uploads/`

## Using Custom Components

### Link Card

To add a link preview card:

1. Click "+" in the editor
2. Select "Link Card"
3. Enter the URL
4. Save

This will insert a LinkCard component into your MDX content.

## Working with Tags

Available tags:
- security
- technology
- hardware
- software
- science
- personal
- tutorial
- review
- analysis
- news
- others

You can select multiple tags for each post.

## Understanding the File Structure

Posts are stored in: `src/content/blog/YYYY/MM/slug.mdx`

- **YYYY**: Year (e.g., 2025)
- **MM**: Month (e.g., 02 for February)
- **slug**: URL-friendly version of the title

Tina automatically generates this structure based on the publish date and title/slug you provide.

## Tips

- **Changes are immediate**: Saves create Git commits automatically
- **Rebuilds take time**: Site rebuilds take 2-3 minutes on most hosting platforms
- **Use Draft mode**: Work on posts without publishing by keeping "Draft" checked
- **Preview is live**: The preview in Tina shows how the post will look on the site
- **Keyboard shortcuts**: Use `Cmd+S` (Mac) or `Ctrl+S` (Windows) to save
- **Markdown support**: You can use markdown syntax in the rich text editor

## Troubleshooting

### Changes not appearing on the site

1. Check that you saved the post
2. Wait 2-3 minutes for the rebuild
3. Clear your browser cache
4. Verify the post is not marked as "Draft"

### Cannot access admin page

1. Ensure you're on the correct URL (`/admin`)
2. Check that your environment variables are set correctly
3. Try clearing browser cache and cookies

### Lost changes

Tina saves to Git, so your changes are in the repository even if the UI has issues. Check the Git history to recover lost work.

## Local Development

When running locally with `npm run dev`:

1. Access admin at `http://localhost:4321/admin`
2. Click "Edit Locally" (no authentication needed)
3. Changes save directly to your local files
4. See changes immediately in the dev server

## Production Workflow

1. Edit content in Tina CMS
2. Save creates a Git commit
3. Commit pushes to GitHub
4. GitHub triggers deployment (Vercel/Cloudflare/etc.)
5. Site rebuilds with new content
6. Changes appear live

## Need Help?

- **Tina Documentation**: https://tina.io/docs/
- **Tina Discord**: https://discord.com/invite/zumN63Ybpf
- **Astro Documentation**: https://docs.astro.build/
