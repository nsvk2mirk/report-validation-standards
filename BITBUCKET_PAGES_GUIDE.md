# Bitbucket Pages - Static Site Hosting

## Overview

**Bitbucket Pages** is Bitbucket's equivalent to GitHub Pages. It allows you to host static websites directly from your Bitbucket repository.

## Comparison: GitHub Pages vs Bitbucket Pages

| Feature | GitHub Pages | Bitbucket Pages |
|---------|-------------|-----------------|
| **Free Tier** | ✅ Yes (Public repos) | ✅ Yes (Public repos) |
| **Private Repos** | ❌ No (requires GitHub Pro) | ✅ Yes (Free for teams) |
| **Custom Domain** | ✅ Yes | ✅ Yes |
| **HTTPS** | ✅ Yes (automatic) | ✅ Yes (automatic) |
| **Jekyll Support** | ✅ Yes | ❌ No |
| **Build Tools** | ✅ Limited | ✅ More flexible |
| **Deployment** | Automatic from branch | Manual trigger or automatic |
| **URL Format** | `username.github.io/repo` | `username.bitbucket.io` or custom |

## Key Advantages of Bitbucket Pages

1. **Free Private Repos**: Host private repositories for free (GitHub requires paid plan)
2. **More Flexible**: Can use custom build processes
3. **Team Collaboration**: Better for private team projects

## Setting Up Bitbucket Pages

### Step 1: Create Bitbucket Repository

1. Go to [bitbucket.org](https://bitbucket.org) and sign in
2. Click **"Create"** → **"Repository"**
3. Name: `report-validation-standards`
4. Set to **Public** (for free Pages) or **Private** (if you have team plan)
5. Click **"Create repository"**

### Step 2: Push Your Code to Bitbucket

```powershell
# Add Bitbucket remote (replace YOUR_USERNAME)
git remote add bitbucket https://bitbucket.org/YOUR_USERNAME/report-validation-standards.git

# Push to Bitbucket
git push -u bitbucket main
```

Or if you want to use Bitbucket instead of GitHub:

```powershell
# Remove GitHub remote (optional)
git remote remove origin

# Add Bitbucket as origin
git remote add origin https://bitbucket.org/YOUR_USERNAME/report-validation-standards.git

# Push to Bitbucket
git push -u origin main
```

### Step 3: Enable Bitbucket Pages

1. Go to your repository on Bitbucket
2. Click **"Repository settings"** (left sidebar)
3. Scroll down to **"Pages"** section
4. Click **"Enable"**
5. Configure:
   - **Branch**: Select `main` (or `master`)
   - **Directory**: `/` (root directory)
6. Click **"Save"**

### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.bitbucket.io/report-validation-standards/
```

**Note:** Bitbucket Pages uses a different URL format than GitHub Pages.

## Important Differences

### URL Structure
- **GitHub**: `username.github.io/repository-name/`
- **Bitbucket**: `username.bitbucket.io/repository-name/`

### Deployment
- **GitHub**: Automatic on every push
- **Bitbucket**: Can be automatic or manual trigger

### Build Process
- **GitHub**: Limited to Jekyll or static files
- **Bitbucket**: More flexible, can use custom build scripts

## Migration from GitHub to Bitbucket

If you want to switch from GitHub to Bitbucket:

```powershell
# Add Bitbucket remote
git remote add bitbucket https://bitbucket.org/YOUR_USERNAME/report-validation-standards.git

# Push to both (keep GitHub as backup)
git push origin main      # GitHub
git push bitbucket main   # Bitbucket
```

Or replace GitHub entirely:

```powershell
# Change remote URL
git remote set-url origin https://bitbucket.org/YOUR_USERNAME/report-validation-standards.git

# Push
git push -u origin main
```

## Using Both GitHub and Bitbucket

You can host on both platforms simultaneously:

```powershell
# Add both remotes
git remote add github https://github.com/YOUR_USERNAME/report-validation-standards.git
git remote add bitbucket https://bitbucket.org/YOUR_USERNAME/report-validation-standards.git

# Push to both
git push github main
git push bitbucket main
```

Then you'll have two URLs:
- GitHub: `https://YOUR_USERNAME.github.io/report-validation-standards/`
- Bitbucket: `https://YOUR_USERNAME.bitbucket.io/report-validation-standards/`

## Requirements for Bitbucket Pages

1. **Repository must be Public** (for free tier) OR
2. **Team plan** (for private repositories)
3. **index.html** in root directory (same as GitHub Pages)
4. **Static files only** (HTML, CSS, JS, images, etc.)

## Custom Domain Setup

1. Go to Repository Settings → Pages
2. Enter your custom domain
3. Update DNS records:
   - Add CNAME record pointing to `YOUR_USERNAME.bitbucket.io`
4. Bitbucket will provide SSL certificate automatically

## Troubleshooting

### Site Not Loading?
- Wait 2-3 minutes after enabling Pages
- Check that `index.html` exists in root
- Verify branch is set correctly in Pages settings

### 404 Error?
- Ensure `index.html` is in the root directory
- Check file names match exactly (case-sensitive)
- Verify Pages is enabled in repository settings

### Build Errors?
- Bitbucket Pages doesn't support Jekyll by default
- Use static HTML files only
- No server-side processing

## Recommendation

**For your use case:**
- ✅ **GitHub Pages** is recommended because:
  - More widely used and documented
  - Simpler setup
  - Better community support
  - Your code is already there

- ✅ **Bitbucket Pages** is good if:
  - You need private repository hosting (free)
  - You're already using Bitbucket for other projects
  - You need more build flexibility

## Current Status

Your project is currently hosted on:
- **GitHub Pages**: `https://nsvk2mirk.github.io/report-validation-standards/`

You can add Bitbucket Pages as an additional hosting option if needed!

