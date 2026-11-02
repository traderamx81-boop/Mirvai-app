# Mirvai website migration and recovery guide

## What remains yours

The `mirvaigroup.com` domain is registered separately through Namecheap. Keep its renewal and account recovery information current. The domain can be redirected to another host without changing the public brand address.

## Current technical shape

The website is a React/Next-compatible application built for a Cloudflare Workers-style runtime. It currently uses:

- A relational database for leads, appointments, chat and property records.
- Object storage for CRM-uploaded property images.
- ChatGPT account identity for administrator access.
- Static public assets stored inside `website-source/public/`.

## Recovery sequence

1. Secure access to the Namecheap account and confirm the domain is renewed.
2. Choose a replacement host that supports the application runtime, or adapt it to a standard Next.js host.
3. Deploy the contents of `website-source/`.
4. Create a replacement SQL database using the schema/migrations included in the source.
5. Import the JSON or CSV files from `crm-data/`.
6. Create replacement object storage for future property uploads.
7. Replace ChatGPT-header authentication with a secure identity provider. Restrict the CRM to the Mirvai administrator and enable MFA.
8. Configure runtime bindings and secrets on the new host. Do not store secrets in the source repository.
9. Test the public homepage, property catalogue, enquiry form, appointment booking, website chat, WhatsApp links, admin login, uploads and SSL.
10. Ask the new host for its A/CNAME records, then update Namecheap DNS. Do not delete unrelated email records.
11. Confirm both `mirvaigroup.com` and `www.mirvaigroup.com` work securely before retiring the previous host.

## CRM data

Each database table is exported in both JSON and CSV. JSON preserves values most accurately and should be preferred for a technical restore. CSV is included for easy viewing and spreadsheet import.

## Property images

All static images tracked with the deployed source are included. At backup time, the live `properties` table has no records, so no active CRM property refers to an object-storage image. Unreferenced uploads cannot be reconstructed from the database export and are not included.

## Verification checklist after restoration

- Homepage loads on mobile and desktop.
- HTTPS certificate is valid on apex and www.
- Admin access is denied to unauthorized accounts.
- Enquiries appear in the CRM.
- Appointment availability and submissions work.
- Website chat sends and receives messages.
- Property uploads accept only approved image formats and sizes.
- WhatsApp opens the correct Mirvai number.
- Privacy notice and consent checkboxes display correctly.
- Search engines receive the correct canonical domain.
