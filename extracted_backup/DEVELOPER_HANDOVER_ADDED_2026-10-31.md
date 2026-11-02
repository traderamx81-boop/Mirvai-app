# MIRVAI Developer Handover — Archived Original Source

This package preserves original website files from MIRVAI's 18 September 2026
portable backup. This handover note and the accompanying example .env file
are newly prepared guidance, NOT part of the original source revision.

## Backup provenance
- Website: https://mirvaigroup.com
- Archived on: 2026-09-18
- Source revision recorded in backup manifest: cff7a955946bd41153f6f7906532c4a69614007e
- Recorded production version at backup: 23
- Current live production state as of 2026-10-31: NOT verified
- No new production build, deployment, or database export was performed.

## Original code
Open `website-source/`. This contains the historical React/Next.js TypeScript
application, CSS, API routes, admin CRM, D1/Drizzle schema and SQL migrations,
and tracked static images and assets.

Key code:
- app/page.tsx, app/globals.css, components/
- app/admin/
- app/api/enquiries/
- app/api/appointments/
- app/api/chat/
- app/api/chat/admin/
- app/api/upload/
- app/api/images/
- app/api/properties/
- db/schema.ts, db/index.ts, drizzle/
- package.json, package-lock.json, vite.config.ts, worker/index.ts

The archived README.md was originally a Vinext starter guide, not a tailored
portability guide. Read `recovery-guide/MIGRATION-GUIDE.md` as well.

## Critical dependencies
- `env.DB` in `cloudflare:workers` is the historical Cloudflare D1 binding
- `env.BUCKET` is the historical Cloudflare R2 object storage binding
- `app/chatgpt-auth.ts` expects OpenAI-managed authentication headers
- Original admin access compares the email claim to a fixed address
- These integrations will need replacement or proper host configuration.
- The provided .env.example is an illustrative new-host template, NOT a working
  drop-in configuration and is NOT part of original code.

## What is not in this source-only developer ZIP
- Private historical CRM database records, supplied in a separate owner-only ZIP.
- Current production database export as of 2026-10-31.
- An exhaustive export of uploaded R2 objects (unreferenced uploads excluded
  even from the September original backup).
- Runtime secrets/credentials, and any source changes since 2026-09-18.
- A live original Git repository (a commit SHA is provided, not repo access).

## Safe migration
1. Independently confirm September snapshot matches the latest live website.
2. Back up current live D1 records and all R2 objects BEFORE deploying.
3. Create a staging environment and configure database, storage, authentication.
4. Replace proprietary ChatGPT sign-in; never treat external request headers
   as authenticated identities without trusted server verification.
5. Run database migrations and import live data once verified.
6. Test all website pages, enquiries, bookings, uploads, chats, admin security.
7. Switch the Namecheap DNS records only after staging and backup verification.
8. Keep registrar and hosting ownership with the MIRVAI owner, grant delegated
   developer access; keep credentials outside the repository and chat.

## Current database export
If there is owner-authorized access to the underlying D1 database through
Cloudflare Wrangler, an authorized operator can use:

    npx wrangler d1 export <ACTUAL_DATABASE_NAME> --remote --output=mirvai-live.sql

`DB` in `.openai/hosting.json` is the application's *binding* and should not be
assumed to be the accessible Cloudflare database name. If this is OpenAI-managed
hosting, request a current export through the site's supported owner controls
or the service provider; this backup cannot supply data newer than 2026-09-18.

## Uploaded images
`website-source/public/` includes tracked static assets. Uploaded R2 images
require a separate, authenticated full bucket export. The September backup
specifically excludes orphaned/unreferenced objects.

## Confidentiality
This developer ZIP excludes the archived CRM-data directory. Do not post
the owner-only archive, backups, secrets, or visitor data in public chats or Git.
