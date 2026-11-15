# Architecture

The site uses HTML, CSS and JavaScript modules, with Three.js bundled for the Nevis explorer. No client framework or remote script service is required. Cloudflare Workers serves the static files and a small same-origin API for Hilo.

```mermaid
sequenceDiagram
  participant Visitor as Browser
  participant Worker as Same-origin Worker
  participant Store as Budget/cache Durable Object
  participant Claude as Anthropic
  Visitor->>Worker: GET public page and fixed fictional scenarios
  Visitor->>Worker: GET /api/status
  Worker-->>Visitor: Availability and short-lived signed request token
  Visitor->>Worker: POST /api/summary (allowlisted scenario/question only)
  Worker->>Worker: Check origin, signature, size, enum and expiry
  Worker->>Store: Request predefined context
  alt Valid cached summary
    Store-->>Visitor: Reuse validated response
  else Budget available
    Store->>Store: Atomically reserve attempt
    Store->>Claude: Fixed system instructions + computed fictional facts
    Claude-->>Store: Structured output
    Store->>Store: Validate shape and basic unsafe assertions; cache
    Store-->>Visitor: Labelled AI summary
  else Unavailable or capped
    Store-->>Visitor: Bounded error; offer labelled sample
  end
```

## Important boundaries

- `public/hilo/scenarios.json` contains synthetic examples. `src/contexts.json` contains fixed computed facts sent to the model; no browser-supplied medical history is accepted.
- `src/system.json` holds the educational prompt. It is not a secret or clinical rule engine.
- `src/policy.mjs` validates report shape, blocks selected unsafe assertions and bounds JSON reads. These checks are defence in depth, not comprehensive medical validation.
- `src/worker.js` provides host/HTTPS handling, same-origin request checks and a shared Durable Object for budgets and cached reports.
- `DATA_VERSION` namespaces cache entries. When changing scenario facts or prompt semantics, update this version to avoid serving an outdated report. The current facts were computed with the original local model; that private Mac connector and its credential storage are not dependencies of this repo.
- `public/_headers` supplies security headers for deployed assets, including same-origin framing for embedded prototypes. Local Wrangler header behaviour should be checked separately from deployed response headers.

The service is a bounded public demonstration, not authenticated medical software. Signed request tokens are not user authentication; an automated client can still obtain one. Atomic budgets limit generation attempts but do not eliminate service abuse, infrastructure charges or denial of service. See [security](../SECURITY.md).
