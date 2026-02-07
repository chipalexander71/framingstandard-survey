# FramingStandard.org — Deployment Guide

## Overview
This project contains two pages:
- **Homepage** (`/`) — static HTML teaser page at `public/home.html`
- **Survey** (`/survey`) — Vite + React app that submits responses to Formspree

Both are deployed together as a single Vercel project.

## Architecture
```
framingstandard.org/          → Homepage (static HTML, served from public/home.html)
framingstandard.org/survey    → Survey app (Vite + React, served from src/Survey.jsx)
```

Vite copies everything in `public/` to the build output verbatim. The homepage lives in
`public/home.html` so it passes through untouched. The survey is the Vite-built React app
with `base: '/survey/'` so its assets are served under that path.

`vercel.json` handles routing:
- `/` → rewrites to `/home.html` (the homepage)
- `/survey` and `/survey/*` → rewrites to the built React app

---

## Prerequisites
- Node.js 18+ installed (https://nodejs.org)
- A GitHub account (https://github.com)
- A Formspree account (https://formspree.io — free tier: 50 submissions/month)
- A Vercel account (https://vercel.com — free tier, sign up with GitHub)

---

## Step 1: Set Up Formspree (2 minutes)

1. Go to https://formspree.io and sign up (free)
2. Click **"New Form"**
3. Name it "Framing Survey" (or whatever you like)
4. Copy the **Form ID** — it looks like `xyzabcde` (from the URL: formspree.io/f/**xyzabcde**)
5. In the Formspree dashboard for this form:
   - Under **Settings > Email Notifications**, make sure your email is listed
   - Under **Settings > Submission Archive**, toggle ON (stores all responses)
   - Under **Settings > Autoresponder** (optional): set up an auto-reply to respondents

## Step 2: Configure the App (1 minute)

Open `src/config.js` and update:

```js
export const FORMSPREE_ID = 'xyzabcde';  // ← Your actual Formspree form ID
export const CONTACT_EMAIL = 'chip@youremail.com';  // ← Your contact email
```

## Step 3: Test Locally (2 minutes)

```bash
cd framingstandard-survey
npm install
npm run dev
```

This starts the Vite dev server. Test both pages:
- http://localhost:5173/ — should show the homepage (Note: in local dev, you may need
  to navigate directly to http://localhost:5173/home.html since Vercel rewrites only
  apply in production. See "Local Dev Notes" below.)
- http://localhost:5173/survey/ — should show the survey

Fill out and submit the survey to verify Formspree receives it.

### Local Dev Notes
Vercel's rewrite rules (`vercel.json`) only apply when deployed to Vercel. During local
development with `npm run dev`:
- The **survey** works at `http://localhost:5173/survey/` (Vite handles this via `base`)
- The **homepage** is accessible at `http://localhost:5173/home.html` (direct file access)
- The root `/` will show Vite's default — this is expected; it routes correctly on Vercel

If you want to test the exact production routing locally, use:
```bash
npm run build
npx serve dist
```
Then visit `http://localhost:3000/` to see the homepage and `/survey` for the survey.
(Install serve first if needed: `npm install -g serve`)

## Step 4: Push to GitHub (3 minutes)

### If this is your first deploy:
```bash
git init
git add .
git commit -m "Initial commit: homepage + framing industry survey"

# Create a new repo on GitHub (https://github.com/new)
# Name it: framingstandard-survey
git remote add origin https://github.com/YOUR_USERNAME/framingstandard-survey.git
git branch -M main
git push -u origin main
```

### If you already deployed the survey and are adding the homepage:
```bash
git add .
git commit -m "Add homepage, update routing"
git push
```
Vercel will auto-deploy on push. No other steps needed — the new `vercel.json` routing
takes effect immediately.

## Step 5: Deploy to Vercel (3 minutes)

### First-time deployment:
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Import your `framingstandard-survey` repo
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Wait ~60 seconds. You'll get a URL like `framingstandard-survey-xyz.vercel.app`
6. Test both pages:
   - `https://your-url.vercel.app/` — homepage
   - `https://your-url.vercel.app/survey` — survey

### Already deployed (adding homepage):
Just push to GitHub. Vercel auto-deploys. Verify both URLs work after deployment.

## Step 6: Connect Your Domain (5 minutes)

### In Vercel:
1. Go to your project → **Settings → Domains**
2. Add `framingstandard.org`
3. Vercel will show you the DNS records you need

### In Porkbun:
1. Log into Porkbun → click on `framingstandard.org` → **DNS Records**
2. Delete any existing A or CNAME records for the root domain
3. Add the records Vercel tells you to:
   - Typically: **A record** → `76.76.21.21` (Vercel's IP)
   - And/or: **CNAME** for `www` → `cname.vercel-dns.com`
4. Save and wait for DNS propagation (usually 5–30 minutes, can take up to 48 hours)

### Redirect other domains (optional):
- Add `pictureframingstandard.org` as a redirect domain in Vercel
- Or in Porkbun, set up URL forwarding from the other domains to `framingstandard.org`

### SSL/HTTPS:
Vercel automatically provisions a free SSL certificate once DNS is connected.

---

## Editing the Homepage

The homepage is a single self-contained HTML file at `public/home.html`. Everything —
styles, markup, scroll animations — is in that one file. No build step required.

To make changes:
1. Edit `public/home.html` in any text editor
2. Commit and push — Vercel auto-deploys
3. Changes are live in ~60 seconds

The homepage uses the same font stack as the survey (Playfair Display + DM Sans, loaded
from Google Fonts) and the same color palette to maintain brand continuity.

### Key sections in home.html:
- **Hero** — main headline, subtitle, and CTA buttons
- **Problem** — four cards describing industry pain points
- **Vision** — the four-pillar strategy (standard, integration, POS, governance)
- **Survey CTA** — call to action driving to `/survey`
- **Footer** — brand, tagline, links

---

## Viewing & Exporting Survey Responses

### Via Formspree Dashboard:
- Log in to https://formspree.io
- Click on your form → **Submissions** tab
- View individual responses, or export as CSV/JSON

### Importing into Requirements Database:
Each submission includes a `_raw_json` field with the complete response data.
Export from Formspree as JSON, then use a script to import into the Excel requirements DB.

---

## Scaling Up

When you're ready for the email campaign and need more than 50 submissions/month:

- **Formspree Gold**: $8/month for 1,000 submissions
- **Formspree Platinum**: $25/month for 5,000 submissions
- **Custom backend**: We can replace Formspree with a Vercel serverless function +
  Supabase (free tier: 50K rows) for unlimited submissions with full data ownership

---

## Project Structure

```
framingstandard-survey/
├── index.html              # Vite entry point (builds the survey React app)
├── package.json            # Dependencies
├── vite.config.js          # Vite config (base: /survey/)
├── vercel.json             # Routing: / → homepage, /survey → React app
├── DEPLOY.md               # This file
├── .gitignore
├── public/
│   ├── home.html           # ← HOMEPAGE (static, copied to dist/ verbatim)
│   └── favicon.svg         # Site favicon (shared by both pages)
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # App wrapper
    ├── config.js           # ← YOUR SETTINGS (Formspree ID, email, branding)
    └── Survey.jsx          # Survey component
```

## URL Structure

| URL | What it serves | Source file |
|-----|---------------|-------------|
| `framingstandard.org/` | Homepage | `public/home.html` |
| `framingstandard.org/survey` | Industry survey | `src/Survey.jsx` (built by Vite) |

---

## Troubleshooting

**Homepage shows the survey instead of the teaser page:**
- Check `vercel.json` — the `/` rewrite to `/home.html` must come BEFORE the survey rewrites
- Redeploy after any `vercel.json` changes

**Homepage not updating after edits:**
- Clear browser cache or hard-refresh (Ctrl+Shift+R)
- Verify the commit was pushed and Vercel deployment completed

**Survey submissions not arriving:**
- Check that FORMSPREE_ID in `config.js` matches your form ID exactly
- Check Formspree dashboard — submissions may be in spam filter
- Verify Formspree email notification is enabled

**Domain not connecting:**
- DNS propagation can take up to 48 hours (usually much faster)
- Verify DNS records in Porkbun match exactly what Vercel specifies
- Check propagation: https://dnschecker.org

**Local dev not starting:**
- Make sure you ran `npm install` first
- Requires Node.js 18+: `node --version`
