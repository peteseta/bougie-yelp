# BougieYelp

my blog lol

## Content Management

This site uses [Tina CMS](https://tina.io) for content management, providing a visual editing interface for blog posts.

### Editing Content

1. Access the admin at `/admin` (production) or `http://localhost:4321/admin` (local)
2. Log in with GitHub (production) or click "Edit Locally" (local development)
3. Edit posts using the visual editor
4. Changes automatically commit to GitHub and trigger rebuilds

For detailed usage instructions, see [TINA_CMS_USER_GUIDE.md](./TINA_CMS_USER_GUIDE.md)

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development with Tina CMS

```bash
# Install dependencies
npm install

# Start development server (includes Tina CMS)
npm run dev
```

Access the site at `http://localhost:4321` and admin at `http://localhost:4321/admin`

### Other Commands

```bash
npm run dev:astro    # Start Astro dev server only (no Tina)
npm run build        # Build for production (includes Tina admin)
npm run preview      # Preview production build
npm run tina:build   # Build Tina admin only
npm run tina:dev     # Start Tina dev server only
```

## Environment Variables

Create a `.env` file for local development:

```bash
TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here
TINA_BRANCH=main
```

Get these values from [Tina Cloud](https://app.tina.io) after setting up your project.

For production deployment, add these environment variables to your hosting platform (Vercel, Cloudflare Pages, etc.).

## Project Structure

```
src/
├── content/
│   └── blog/          # Blog posts (MDX format)
│       └── YYYY/MM/   # Organized by year/month
├── pages/
│   └── admin.astro    # Tina CMS admin interface
└── components/
    └── LinkCard.astro # Custom MDX component

tina/
└── config.ts          # Tina CMS configuration

public/
└── uploads/           # Media uploaded via Tina CMS
```

## Technologies

- [Astro](https://astro.build) - Static site framework
- [Tina CMS](https://tina.io) - Content management system
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [MDX](https://mdxjs.com) - Markdown with components
