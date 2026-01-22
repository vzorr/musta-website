#Requires -Version 5.1
<#
.SYNOPSIS
    Deploys myusta-landing-page to Azure App Service (myusta.al)

.DESCRIPTION
    ============================================================================
    MYUSTA LANDING PAGE DEPLOYMENT SCRIPT
    ============================================================================

    Target URL:     https://myusta.al
    Azure App:      myusta-landingPage
    Resource Group: myusta-rg
    App Service:    myusta-api-plan (shared with web app)

    This script automates the entire deployment process:
    1. Checks Azure CLI login and git remotes
    2. Commits any uncommitted changes (optional)
    3. Upgrades App Service Plan to B3 (7GB RAM) for build
    4. Pushes to Azure Git remote (triggers Oryx build)
    5. Restarts the app to load new build
    6. Verifies deployment with HTTP 200 check
    7. Downgrades back to B1 to save costs

    TYPICAL DEPLOYMENT TIME: ~7-8 minutes

    REQUIREMENTS:
    - Azure CLI installed and logged in (run 'az login' first)
    - Git installed
    - PowerShell 5.1 or higher

    COST OPTIMIZATION:
    The script automatically upgrades to B3 tier (~$70/month) for builds
    and downgrades back to B2 (~$26/month) after deployment. Note: B1 tier
    has insufficient memory for 3 apps sharing the plan (myusta.al,
    app.myusta.al, api.myusta.al).

    TROUBLESHOOTING:
    - If git push fails with "index.lock" error, the script auto-fixes it
    - If verification fails, check https://myusta.al manually
    - Logs available at: https://myusta-landingPage.scm.azurewebsites.net

    ============================================================================

.PARAMETER CommitMessage
    Optional commit message. If provided, will commit all changes before deploying.
    Example: -CommitMessage "Fix contact form"

.PARAMETER SkipUpgrade
    Skip the B3 upgrade (use if already on B3 or higher tier)

.PARAMETER SkipDowngrade
    Skip the B1 downgrade after deployment (keeps B3 running - higher cost!)

.PARAMETER Branch
    Local branch to deploy. Default: main

.PARAMETER Force
    Force rebuild even if no changes (creates empty commit to trigger build)

.EXAMPLE
    .\deploy-to-azure.ps1
    # Standard deployment - deploy current committed changes

.EXAMPLE
    .\deploy-to-azure.ps1 -CommitMessage "Add Google Analytics"
    # Commit all changes and deploy in one step

.EXAMPLE
    .\deploy-to-azure.ps1 -Force
    # Force rebuild even without code changes

.EXAMPLE
    .\deploy-to-azure.ps1 -SkipUpgrade -SkipDowngrade
    # Deploy without changing App Service Plan tier (use if already on B3)

.NOTES
    Author: MyUSTA Team
    Last Updated: January 2026
    Repository: myusta-landing-page
#>

param(
    [string]$CommitMessage = "",
    [switch]$SkipUpgrade,
    [switch]$SkipDowngrade,
    [switch]$Force,
    [string]$Branch = "main"
)

# Configuration
$ResourceGroup = "myusta-rg"
$AppServicePlan = "myusta-api-plan"
$WebAppName = "myusta-landingPage"
$AzureRemote = "azure"
$TargetUrl = "https://myusta.al"
$HighTier = "B3"
$LowTier = "B2"  # B1 has insufficient memory for 3 apps sharing the plan

# Colors for output
function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Failure { param($msg) Write-Host "[FAIL] $msg" -ForegroundColor Red }

# Track start time
$startTime = Get-Date

Write-Host "`n=============================================" -ForegroundColor Magenta
Write-Host "  MyUSTA Landing Page - Azure Deployment" -ForegroundColor Magenta
Write-Host "=============================================`n" -ForegroundColor Magenta

# Ensure we're in the right directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
Set-Location $projectDir
Write-Host "Working directory: $projectDir"

# Check if Azure CLI is installed and logged in
Write-Step "Checking Azure CLI..."
try {
    $account = az account show 2>$null | ConvertFrom-Json
    if (-not $account) {
        Write-Failure "Not logged into Azure CLI. Run 'az login' first."
        exit 1
    }
    Write-Success "Logged in as: $($account.user.name)"
} catch {
    Write-Failure "Azure CLI not found or not logged in. Run 'az login' first."
    exit 1
}

# Check if azure remote exists, if not add it
Write-Step "Checking Git remotes..."
$remotes = git remote
if ($remotes -notcontains "azure") {
    Write-Warning "Azure remote not configured. Adding it now..."
    git remote add azure "https://`$myusta-landingPage:mkPxyBBxTxY9DcSGh1zwrse5mElupTxtawiymbkZAy2twkaitA80A0ZauACB@myusta-landingPage.scm.azurewebsites.net/myusta-landingPage.git"
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Failed to add Azure remote"
        exit 1
    }
}
Write-Success "Azure remote configured"

# Commit changes if message provided
if ($CommitMessage) {
    Write-Step "Committing changes..."
    git add .
    $status = git status --porcelain
    if ($status) {
        git commit -m $CommitMessage
        if ($LASTEXITCODE -ne 0) {
            Write-Failure "Git commit failed"
            exit 1
        }
        Write-Success "Changes committed: $CommitMessage"
    } else {
        Write-Warning "No changes to commit"
    }
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Warning "You have uncommitted changes. They will NOT be deployed."
    Write-Host $status
    $response = Read-Host "Continue anyway? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Aborted."
        exit 0
    }
}

# Force push option - create empty commit if needed
if ($Force) {
    Write-Step "Force rebuild requested - creating trigger commit..."
    git commit --allow-empty -m "Trigger rebuild $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    Write-Success "Trigger commit created"
}

# Upgrade to B3
if (-not $SkipUpgrade) {
    Write-Step "Upgrading App Service Plan to $HighTier (7GB RAM)..."
    az appservice plan update --name $AppServicePlan --resource-group $ResourceGroup --sku $HighTier 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Failed to upgrade App Service Plan"
        exit 1
    }
    Write-Success "Upgraded to $HighTier"
} else {
    Write-Warning "Skipping upgrade (--SkipUpgrade specified)"
}

# Push to Azure
Write-Step "Pushing to Azure (this triggers the build)..."
Write-Host "Branch: $Branch -> master"
Write-Host "This will take 5-10 minutes for landing page. Please wait...`n"

# Push and capture output
$pushOutput = git push $AzureRemote "${Branch}:master" --force 2>&1
$pushExitCode = $LASTEXITCODE

# Display push output
Write-Host $pushOutput

if ($pushExitCode -ne 0) {
    Write-Failure "Git push failed!"

    # Check for common errors
    if ($pushOutput -match "index.lock") {
        Write-Host "`nTrying to fix git lock file..."
        $creds = az webapp deployment list-publishing-credentials --name $WebAppName --resource-group $ResourceGroup --query "{user:publishingUserName,pass:publishingPassword}" -o json | ConvertFrom-Json
        $authHeader = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($creds.user):$($creds.pass)"))

        Invoke-RestMethod -Uri "https://$WebAppName.scm.azurewebsites.net/api/command" `
            -Method POST `
            -Headers @{ Authorization = "Basic $authHeader" } `
            -ContentType "application/json" `
            -Body '{"command":"rm -f /home/site/repository/.git/index.lock","dir":"/home/site/wwwroot"}'

        Write-Host "Lock file removed. Please run the script again."
    }

    # Downgrade even on failure to save costs
    if (-not $SkipDowngrade -and -not $SkipUpgrade) {
        Write-Step "Downgrading App Service Plan to $LowTier (to save costs)..."
        az appservice plan update --name $AppServicePlan --resource-group $ResourceGroup --sku $LowTier 2>&1 | Out-Null
    }
    exit 1
}

Write-Success "Git push completed!"

# Wait a moment for deployment to settle
Write-Step "Waiting for deployment to settle (15 seconds)..."
Start-Sleep -Seconds 15

# Restart the app to ensure new build is loaded
Write-Step "Restarting the app..."
az webapp restart --name $WebAppName --resource-group $ResourceGroup 2>&1 | Out-Null
Write-Success "App restarted"

# Wait for app to come back up
Write-Host "Waiting 10 seconds for app to restart..."
Start-Sleep -Seconds 10

# Verify deployment
Write-Step "Verifying deployment..."
$maxAttempts = 6
$attempt = 0
$success = $false

while ($attempt -lt $maxAttempts -and -not $success) {
    $attempt++
    Write-Host "Attempt $attempt of $maxAttempts..."

    try {
        $response = Invoke-WebRequest -Uri $TargetUrl -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            $success = $true
            Write-Success "Site is responding with HTTP 200!"
        }
    } catch {
        Write-Warning "Site not ready yet (Status: $($_.Exception.Response.StatusCode))"
        if ($attempt -lt $maxAttempts) {
            Write-Host "Waiting 30 seconds before retry..."
            Start-Sleep -Seconds 30
        }
    }
}

if (-not $success) {
    Write-Warning "Site verification failed after $maxAttempts attempts"
    Write-Host "The deployment may still be in progress. Check manually: $TargetUrl"
}

# Downgrade to B1
if (-not $SkipDowngrade) {
    Write-Step "Downgrading App Service Plan to $LowTier (saving costs)..."
    az appservice plan update --name $AppServicePlan --resource-group $ResourceGroup --sku $LowTier 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Failed to downgrade App Service Plan. Please downgrade manually!"
        Write-Host "Run: az appservice plan update --name $AppServicePlan --resource-group $ResourceGroup --sku $LowTier"
    } else {
        Write-Success "Downgraded to $LowTier"
    }
} else {
    Write-Warning "Skipping downgrade (--SkipDowngrade specified)"
}

# Summary
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n=============================================" -ForegroundColor Magenta
Write-Host "  Deployment Complete!" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta
Write-Host "Duration: $($duration.ToString('mm\:ss'))"
Write-Host "URL: $TargetUrl"

if ($success) {
    Write-Success "Deployment successful!"
    exit 0
} else {
    Write-Warning "Deployment completed but verification failed. Check the site manually."
    exit 1
}
