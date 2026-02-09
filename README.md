# FramingStandard.org — Industry Survey

An open survey platform built to understand how independent picture frame shops operate — their workflows, tools, supplier relationships, and pain points.

## Why This Exists

The custom picture framing industry runs on aging POS systems with closed data models, no interoperability, and limited insight into real shop economics. Many frame shops can't even track purchases from non-industry suppliers (lumber yards, hardware stores, glass distributors) — a significant and invisible category of spend.

**FramingStandard.org** is an initiative to modernize how frame shops manage their businesses, starting with listening to shop owners about how they actually work.

This survey is the first step.

## What It Does

- Six-section survey covering shop demographics, framing workflow, POS usage, supplier relationships, pain points, and future priorities
- Conditional fields that adapt based on responses (e.g., POS-specific questions only appear if a POS system is in use)
- Anonymous by default with optional contact info for follow-up
- Responses stored securely with row-level security (anonymous insert only)

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Supabase (Postgres with RLS)
- **Notifications:** Resend (webhook-triggered email on new submissions)
- **Hosting:** Vercel (auto-deploys from this repo)
- **Domain:** [framingstandard.org](https://framingstandard.org)

## Live

- **Homepage:** [framingstandard.org](https://framingstandard.org)
- **Survey:** [framingstandard.org/survey](https://framingstandard.org/survey)

## About

Built by [Chip Alexander](https://x.com/ChipLMS) and Laura Everett (30+ years in professional picture framing). We believe frame shop owners deserve tools that work for them — starting with software that actually understands their industry.

## License

All rights reserved. This repository is public for transparency, not for redistribution.
