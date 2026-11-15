# Security

## Report a concern privately

Please use GitHub's **Report a vulnerability** option on this repository when available. Do not put credentials, medical information or an exploit against the live demo in a public issue. Repository security reports concern this code; the Hilo concept is not a medical support service.

## Credential boundary

- No Anthropic or Cloudflare key belongs in source, an image, a PDF, a commit, the browser bundle or a public issue.
- `.dev.vars`, environment files, local deployment configuration, Wrangler state and logs are ignored. `.dev.vars.example` has no key.
- Production uses the encrypted Cloudflare Worker secret `ANTHROPIC_API_KEY`. This repo contains no saved key or GitHub deployment secret.
- The local Mac Keychain connector, private connection page, correspondence, account/DNS backups, full portfolio PDF and CV PDF are not included. Website download links remain owner-managed outside Git.
- Do not run production deployment from untrusted branches. CI has read-only repository permissions, no secrets and no publishing step.

## Hilo service controls

Only fixed fictional scenario/question identifiers are accepted. Requests are origin-checked, signed, size-bounded and expiry-gated; urgent/unknown scenarios and extra fields are rejected. A shared coordinator reserves attempts atomically: 12 per UTC day and 40 per UTC month, including failed attempts. Valid reports are reused from the cache. There is a global 90-summary-requests/minute gate, a 45-second provider timeout and a 1,200-output-token limit.

Reports are schema-checked, checked for selected unsafe phrases and inserted as text rather than executable HTML. The model does not receive a browser-supplied patient record or open-ended prompt. No email, push message or GP contact is sent.

## Limits

This is a portfolio demonstration, not a hardened clinical product. Origin checks and signed tokens are not authentication and cannot stop every automated visitor. Generation caps bound attempted model calls, not all hosting costs. Prompt and phrase checks cannot guarantee medically appropriate output. Cloudflare/Anthropic platform policies still apply; disabled application logging does not imply that infrastructure providers collect nothing. Cached reports contain synthetic data only.

## Before publishing any change

Run `npm test`, `npm run check` and `npm run build`. Inspect staged filenames, diffs and assets; `npm run secrets:check` is a pattern check, not proof that every possible secret or confidential detail is absent. Use a reputable full-history scanner as an additional review if importing history. Never import the old working directory or its logs wholesale.

If a real key is exposed, revoke it with its provider immediately, replace the affected secret and clean the repository/history as appropriate. Deleting a visible file is not revocation.
