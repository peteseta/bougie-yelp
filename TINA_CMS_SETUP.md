# Tina CMS Setup Instructions

The Tina CMS integration has been implemented! Follow these steps to complete the setup and start using the visual editor.

## ✅ What's Already Done

- ✅ Tina CMS packages installed
- ✅ Configuration file created (`/tina/config.ts`)
- ✅ Admin route set up (`/admin`)
- ✅ Astro configured for hybrid mode
- ✅ Media upload folder created
- ✅ Documentation written
- ✅ Package scripts updated

## 🚀 Next Steps Required

### Step 1: Create a Tina Cloud Account (5 minutes)

1. Go to https://app.tina.io/register
2. Click "Sign up with GitHub"
3. Authorize Tina to access your GitHub account
4. Create a new project

### Step 2: Connect Your GitHub Repository (2 minutes)

1. In the Tina Cloud dashboard, click "Create a new project"
2. Select your repository: `peteseta/bougie-yelp`
3. Choose your default branch (typically `main`)
4. Click "Continue"

### Step 3: Get Your API Credentials (1 minute)

1. In the Tina Cloud project dashboard, go to "Overview" or "Settings"
2. Copy your **Client ID**
3. Copy your **Read-Only Token**

### Step 4: Add Environment Variables

#### For Local Development:

Create a `.env` file in the project root:

```bash
TINA_CLIENT_ID=your_client_id_here
TINA_TOKEN=your_token_here
TINA_BRANCH=main
```

Replace `your_client_id_here` and `your_token_here` with the values from Step 3.

#### For Production (Vercel):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - `TINA_CLIENT_ID` = your client ID
   - `TINA_TOKEN` = your token
   - `TINA_BRANCH` = main

#### For Production (Cloudflare Pages):

1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the same three variables as above

### Step 5: Build and Test (5 minutes)

#### Test Locally:

```bash
# Install dependencies (if not already done)
npm install

# Build Tina admin
npm run tina:build

# Start dev server with Tina
npm run dev
```

Then:
1. Open http://localhost:4321/admin
2. Click "Edit Locally" (no login needed for local)
3. You should see your blog posts listed
4. Try editing one to test

#### Test in Production:

1. Commit and push your changes
2. Wait for the build to complete
3. Visit `https://your-site.com/admin`
4. Log in with GitHub
5. You should be able to edit posts!

### Step 6: Verify Everything Works

**Checklist:**

- [ ] Can access `/admin` route
- [ ] Can see list of blog posts
- [ ] Can open and edit a post
- [ ] Can save changes
- [ ] Changes create a Git commit
- [ ] Changes appear on the live site (after rebuild)
- [ ] Can create a new post
- [ ] New post saves to correct folder structure (`YYYY/MM/slug.mdx`)
- [ ] Can upload images
- [ ] LinkCard component works in editor

## 🎯 How to Use After Setup

### Creating a New Post

1. Go to `/admin`
2. Click "Blog Posts" → "Create New"
3. Fill in:
   - Title
   - Description
   - Tags
   - Check "Draft" if not ready to publish
4. Write content in the editor
5. Click Save
6. Done! It will automatically:
   - Save to `src/content/blog/YYYY/MM/slug.mdx`
   - Create a Git commit
   - Trigger a rebuild
   - Appear on your site in ~2-3 minutes

### Editing an Existing Post

1. Go to `/admin`
2. Find the post in the list
3. Click to open
4. Make your edits
5. Save
6. Changes go live after rebuild

## 🔧 Troubleshooting

### "Client not configured properly" error

- **Cause**: Missing or incorrect environment variables
- **Solution**: Double-check your `.env` file has the correct `TINA_CLIENT_ID` and `TINA_TOKEN`

### Admin page shows 404

- **Cause**: Build hasn't run yet
- **Solution**: Run `npm run tina:build` first, then start dev server

### Changes not appearing on site

- **Cause**: Draft mode enabled or build still in progress
- **Solution**:
  - Make sure "Draft" is unchecked
  - Wait 2-3 minutes for rebuild to complete
  - Check your hosting platform's build logs

### Cannot save changes

- **Cause**: Git permissions or authentication issue
- **Solution**:
  - In Tina Cloud, verify GitHub repository access
  - Check that the token has write permissions
  - Make sure you're logged in with the correct GitHub account

## 📚 Resources

- **Tina CMS Documentation**: https://tina.io/docs/
- **Tina Cloud Dashboard**: https://app.tina.io
- **Tina Discord Community**: https://discord.com/invite/zumN63Ybpf
- **User Guide**: See `TINA_CMS_USER_GUIDE.md` in this repo

## 💡 Tips

1. **Free Tier**: Tina Cloud's free tier supports 2 users and 2 repositories - perfect for personal blogs!
2. **Local Development**: You can edit posts locally without cloud credentials by clicking "Edit Locally"
3. **Git History**: Every save creates a Git commit, so you have full version history
4. **Preview**: The Tina editor shows a live preview as you type
5. **Keyboard Shortcuts**: Use Cmd/Ctrl + S to save quickly

## 🎉 You're All Set!

Once you complete the steps above, you'll have a fully functional visual CMS for your blog. No more manual MDX editing - just use the beautiful Tina interface!

Need help? Check the troubleshooting section above or reach out on the Tina Discord.
