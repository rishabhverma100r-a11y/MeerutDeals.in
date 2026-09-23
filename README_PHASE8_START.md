Meerut Deals — Phase 8 Production Preparation
Updated: 2026-09-23

Completed in this Phase 8 start package:
1. Production customer build assembled with Supabase gateway adapter + gateway config.
2. Customer chat adapter includes messages/sendMessage with 2,000-character validation.
3. Admin production build no longer bundles the previous admin access key.
4. Admin panel now requires the access key at runtime and stores it only in sessionStorage.
5. Previous admin fallback demo orders are disabled for production behavior.
6. Supabase admin access-key hash was rotated in app_settings.
7. Supabase security advisor currently reports 0 security findings.
8. Gateway is ACTIVE v2.
9. Customer/admin JavaScript syntax checks pass.

Important deployment notes:
- The live public deployment has NOT been claimed in this package.
- Vercel access for the previously known team scope currently returned 403, so deployment must use an authorized Vercel scope/account.
- A permanent custom domain has not been connected yet.
- Live browser/mobile E2E remains a separate verification step.
- The new admin access key is intentionally not stored in this package.
