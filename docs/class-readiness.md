# CareerUp class release

This release targets at least 25 simultaneous signed in students. Functional tests, privacy tests and capacity measurements are separate evidence. A successful build alone is not a readiness result.

## Release requirements

1. The deployed version must match the tested source commit.
2. Private profiles and resume text must be visible only to their owner. Ordinary clients must not change XP, roles, reward balances or internal award flags.
3. Application sharing must require both an accepted friendship and the owner's sharing setting. Shared boards must omit private notes. Disabling sharing must also remove peer lookup access.
4. Private APIs and database access must enforce enrolled MFA and reject revoked sessions. Public job listings remain readable.
5. Friendship acceptance, group membership and message updates must enforce the intended participants and editable fields.
6. Sign up, email confirmation, sign in, logout and password recovery must work for ordinary class email addresses. Production SMTP and actual delivery require verification separately from administrator-created test accounts.
7. Search, resume upload, applications, calendar, challenges, rewards, social pages, email review and AI coach must work through the running application.
8. At least 25 independent accounts must exercise the deployed application concurrently. Record requests, errors, timing distributions and cleanup. Synthetic account setup must not be described as public signup testing.
9. Real Gemini text and voice calls must succeed with explicit consent. Gmail OAuth access must work for the intended class audience, not only the project owner's account.
10. Previously shared credentials must be rotated and removed from operational use. Secrets must never appear in committed files, browser bundles, test reports or logs.

## Privacy design

The profiles table is owner only and browser roles have no update grant. Server handlers verify the active session, enrolled MFA and owner before mutating profile data. Public social pages deliberately select only profile summary fields on the server. Email addresses, resumes and reward balances never belong in this public projection.

Accepted friends receive an explicit shared board projection through `shared_application_board`. It includes displayed job fields and excludes private notes. Peer results use the same sharing rule. General application table access remains owner only.

Progress awards use a server-only atomic RPC with row locking. End users cannot call the old arbitrary amount function. A restrictive database policy checks the session ID against active Auth sessions and enforces verified second factors. Group helpers perform bounded private membership checks to avoid recursive RLS.

## Verification commands

`npm run verify:class:database` creates and removes an isolated PostgreSQL container and checks ownership, sharing, scores, group permissions, MFA and revocation.

`CAREERUP_PRIVATE_ENV=/private/path/.env.local npm run verify:class:load` requires a running app, creates disposable synthetic accounts and removes them afterward. Use the explicit deployed-test flag for a hosted target. Its report contains aggregate measurements only. It does not send real email or certify SMTP delivery, Gmail audience approval or AI recommendation accuracy.

Provider quotas and SMTP configuration are independent of Supabase database capacity. Do not disable verification or auto-confirm ordinary student accounts as an email delivery workaround.
