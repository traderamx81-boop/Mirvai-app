# Mirvai Portable Recovery Backup

Created: 18 September 2026  
Live website: https://mirvaigroup.com  
Production version: 23  
Source revision: `cff7a955946bd41153f6f7906532c4a69614007e`

This package is a portable recovery copy of the Mirvai website and the available live CRM data. Creating it did **not** change, republish or interrupt the live website.

## What is included

- `website-source/` — exact tracked source code and static assets from the current production revision.
- `crm-data/` — exports of enquiries, appointments, property records, website conversations/messages and analytics in JSON and CSV.
- `domain-and-dns/` — the current Mirvai domain routing and verification records.
- `recovery-guide/` — practical instructions for moving the website to another hosting provider.
- `site-metadata.json` and `version-history.json` — sanitized hosting and release information.
- `CHECKSUMS.sha256` — generated after packaging so the archive can be checked for corruption.

## CRM snapshot

| Table | Records |
|---|---:|
| Analytics events | 233 |
| Enquiries/leads | 0 |
| Appointments | 0 |
| Website conversations | 0 |
| Website messages | 0 |
| Published CRM properties | 0 |

The CRM currently contains no leads, appointments, website chats or CRM-published properties. Static source assets include the earlier Adeniyi Jones property images, but that property remains disabled from public display.

## Security

This backup deliberately excludes passwords, sign-in tokens and other secrets. It may still contain private business or visitor information, particularly analytics session identifiers and future CRM exports. Keep it private and do not post the archive publicly.

## Important limitation

The current application expects managed database, object-storage and ChatGPT sign-in services. A competent web developer can migrate the source, but they must configure replacement database/storage services and replace the admin authentication before launching it on another host.
