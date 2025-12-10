# GitHub Pages Setup Guide

## Quick Setup Steps

### Step 1: Initialize Git Repository (if not already done)

Open PowerShell or Command Prompt in your project folder and run:

```powershell
cd C:\Users\vamsi.nistala\Documents\CursorNewAI\Validations\PPTX
git init
git add .
git commit -m "Initial commit - Report Validation Standards"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `report-validation-standards` (or any name you prefer)
4. Description: "Report Validation Standards for Data Analytics & AI"
5. Set to **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

### Step 3: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your PowerShell:

```powershell
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/report-validation-standards.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You'll be prompted for your GitHub username and password (use a Personal Access Token instead of password).

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **"Save"**

### Step 5: Access Your Live Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/report-validation-standards/
```

**Note:** It may take 1-2 minutes for the site to go live after enabling Pages.

---

## Creating a Personal Access Token (if needed)

If GitHub asks for authentication:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Name it: "Local Development"
4. Select scopes: **repo** (all checkboxes under repo)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## Testing Your Site

1. Wait 1-2 minutes after enabling Pages
2. Visit: `https://YOUR_USERNAME.github.io/report-validation-standards/`
3. Test all features:
   - Navigation between slides
   - "Get Started" button
   - "Present" fullscreen mode
   - "Download" ZIP functionality
   - Validation Checklist link

---

## Updating Your Site

Whenever you make changes:

```powershell
git add .
git commit -m "Description of changes"
git push
```

Your site will automatically update within 1-2 minutes!

---

## Troubleshooting

### Site not loading?
- Wait 2-3 minutes (first deployment takes time)
- Check repository Settings → Pages to ensure it's enabled
- Verify branch is set to "main"

### 404 Error?
- Make sure `Report_Validation_Standards.html` is in the root folder
- Check file names match exactly (case-sensitive)

### Download button not working?
- The download feature works best when hosted (not file://)
- Once on GitHub Pages, it should work perfectly

---

## Sharing with Your Team

Share this URL:
```
https://YOUR_USERNAME.github.io/report-validation-standards/
```

Everyone can:
- View the presentation
- Click "Download" to get the ZIP file
- Access the Validation Checklist

---

## Next Steps

1. ✅ Complete the setup above
2. ✅ Test your live site
3. ✅ Share the URL with your team
4. ✅ Test the download functionality

Your presentation is now live and shareable! 🎉

