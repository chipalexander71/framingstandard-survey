# FramingStandard.org Survey — Deployment Guide

## Overview
This is a Vite + React survey app that submits responses to Formspree.
Deploy to Vercel (free tier) and point your domain at it.

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
   - Under **Settings > Submission Archive**, toggle ON (this stores all responses)
   - Under **Settings > Autoresponder** (optional): you can set up an auto-reply to respondents who include an email

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

Open http://localhost:5173 — fill out the survey, submit, verify you receive the email from Formspree.

## Step 4: Push to GitHub (3 minutes)

```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit: framing industry survey"

# Create a new repo on GitHub (https://github.com/new)
# Name it: framingstandard-survey
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/framingstandard-survey.git
git branch -M main
git push -u origin main
```

## Step 5: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Import your `framingstandard-survey` repo
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Wait ~60 seconds. You'll get a URL like `framingstandard-survey-xyz.vercel.app`
6. Test the live URL to confirm it works

## Step 6: Connect Your Domain (5 minutes)

### In Vercel:
1. Go to your project → **Settings → Domains**
2. Add `framingstandard.org`
3. Vercel will show you the DNS records you need to add

### In Porkbun:
1. Log into Porkbun → click on `framingstandard.org` → **DNS Records**
2. Delete any existing A or CNAME records for the root domain
3. Add the records Vercel tells you to:
   - Typically: **A record** → `76.76.21.21` (Vercel's IP)
   - And/or: **CNAME** for `www` → `cname.vercel-dns.com`
4. Save and wait for DNS propagation (usually 5-30 minutes, can take up to 48 hours)

### Repeat for other domains (optional):
- Add `pictureframingstandard.org` as a redirect domain in Vercel
- Or in Porkbun, set up URL forwarding from the other domains to `framingstandard.org`

### SSL/HTTPS:
Vercel automatically provisions a free SSL certificate once DNS is connected.
Your site will be served over HTTPS with no additional configuration.

---

## Ongoing: Viewing & Exporting Responses

### Via Formspree Dashboard:
- Log in to https://formspree.io
- Click on your form → **Submissions** tab
- View individual responses, or export as CSV/JSON

### Importing into Requirements Database:
Each submission includes a `_raw_json` field containing the complete response data.
Export from Formspree as JSON, then use a script to import into the Excel requirements DB.

---

## Scaling Up

When you're ready for the email campaign and need more than 50 submissions/month:

- **Formspree Gold**: $8/month for 1,000 submissions
- **Formspree Platinum**: $25/month for 5,000 submissions
- **Custom backend**: When the time comes, we can replace Formspree with a 
  Vercel serverless function + Supabase (free tier: 50K rows) for unlimited 
  submissions with full data ownership

---

## Project Structure

```
framingstandard-survey/
├── index.html          # HTML shell with meta tags
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration (base: /survey/)
├── vercel.json         # Vercel routing: /survey path + root redirect
├── public/
│   └── favicon.svg     # Site favicon
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx          # App wrapper
    ├── config.js       # ← YOUR SETTINGS GO HERE
    └── Survey.jsx      # Survey component (all the magic)
```

## URL Structure

- `https://framingstandard.org/survey` — the live survey
- `https://framingstandard.org/` — temporarily redirects to /survey
- Later: root domain becomes a landing page, /survey stays where it is

## Troubleshooting

**Survey submissions not arriving:**
- Check that FORMSPREE_ID in config.js matches your form ID exactly
- Check Formspree dashboard — submissions may be in spam filter
- Verify Formspree email notification is enabled

**Domain not connecting:**
- DNS propagation can take up to 48 hours (usually much faster)
- Verify the DNS records in Porkbun match exactly what Vercel specifies
- Try: https://dnschecker.org to check propagation status

**Local dev not starting:**
- Make sure you ran `npm install` first
- Requires Node.js 18 or higher: `node --version`
