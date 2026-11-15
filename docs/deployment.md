# Local setup and deployment

## Explore without accounts

Install Node 22 or 24, then run `npm ci` and `npm run dev`. Open http://localhost:8787/. Wrangler simulates the Worker and Durable Object locally. The default expiry is zero, so provider calls stay disabled; the visitor can use the labelled sample summary. No browser connection page is included.

## Optional local AI

Only the owner should enable paid model use. Copy `.dev.vars.example` to `.dev.vars` and use a trusted local editor to add `ANTHROPIC_API_KEY` and a deliberately chosen future `AI_ENABLED_UNTIL` timestamp in milliseconds. Never paste a real key into a command argument, public issue or chat. Restart the dev server. The API accepts only the shipped fictional histories; the key never goes to the browser. Delete the local file when no longer needed and revoke the key with its provider if exposed.

## Validate

```sh
npm test
npm run check
npm run build
```

`build` runs Wrangler's dry-run bundle validation. Static assets are already in `public/`; no separate browser compilation is required. CI runs these checks without secrets and does not publish.

## Production · manual owner action

1. Authenticate to the intended Cloudflare account with `npx wrangler login`.
2. Copy `wrangler.production.example.jsonc` to the ignored `wrangler.production.jsonc`. Review Worker name, allowed hosts in `src/worker.js`, domain routes, bindings, model, data version and expiry. Add your account ID if needed. The example deliberately disables AI; do not reset an existing paid service's expiry by accident.
3. For the existing live Worker, preserve its current secret, Durable Object migration and data-version settings. Do not install a new key if the existing encrypted secret is still intended. For a new deployment, enter the provider key using the private prompt from `npx wrangler secret put ANTHROPIC_API_KEY --config wrangler.production.jsonc`.
4. Run `npx wrangler deploy --config wrangler.production.jsonc --dry-run`.
5. Publish only after reviewing the diff: `npx wrangler deploy --config wrangler.production.jsonc`.
6. Check HTTP/HTTPS apex and www, preserved Hilo paths/query, same-origin embedded previews, CV and assets, keyboard/motion/mobile behaviour, and AI availability. Never test with real health data.

The public source contains no account identifier, active production expiry, key or DNS backup. The live deployment configuration is managed separately. Roll back with Wrangler's version/rollback tools if verification fails; repository ownership changes do not migrate hosting.
