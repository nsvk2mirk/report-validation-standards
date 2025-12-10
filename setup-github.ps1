# GitHub Setup Script for Report Validation Standards
# Run this script in PowerShell from your project directory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 1: Initializing Git repository..." -ForegroundColor Yellow

# Initialize git if not already done
if (-not (Test-Path .git)) {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - Report Validation Standards" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "⚠ Commit may have failed or no changes to commit" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to https://github.com and create a new repository" -ForegroundColor White
Write-Host "2. Name it: report-validation-standards" -ForegroundColor White
Write-Host "3. Set it to PUBLIC (required for free GitHub Pages)" -ForegroundColor White
Write-Host "4. DO NOT initialize with README" -ForegroundColor White
Write-Host "5. Copy the repository URL" -ForegroundColor White
Write-Host ""
Write-Host "Then run these commands (replace YOUR_USERNAME):" -ForegroundColor Yellow
Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/report-validation-standards.git" -ForegroundColor Cyan
Write-Host "  git branch -M main" -ForegroundColor Cyan
Write-Host "  git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Go to repository Settings → Pages" -ForegroundColor White
Write-Host "7. Select branch: main, folder: / (root)" -ForegroundColor White
Write-Host "8. Your site will be live at:" -ForegroundColor White
Write-Host "   https://YOUR_USERNAME.github.io/report-validation-standards/" -ForegroundColor Green
Write-Host ""
Write-Host "See GITHUB_SETUP.md for detailed instructions!" -ForegroundColor Yellow
Write-Host ""

