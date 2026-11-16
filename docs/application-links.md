# Choose the opening story with a portfolio link

The URL chooses the lead story without changing everyone else's portfolio. No login, cookie, API call or saved personalisation is needed. A refresh or copied link keeps the same choice.

| Link                           | Opening story                               |
| ------------------------------ | ------------------------------------------- |
| `https://amaplan.com/`         | General portfolio; Hilo is in the work list |
| `https://amaplan.com/?xps`     | Independent XPS retirement-request concept  |
| `https://amaplan.com/?hilo`    | Independent Hilo concept                    |
| `https://amaplan.com/?royal`   | Royal London employer website               |
| `https://amaplan.com/?braze`   | Braze knowledge pages and sales tools       |
| `https://amaplan.com/?capital` | Express Capital pitched calculator          |
| `https://amaplan.com/?fuse`    | Fuse brand system                           |
| `https://amaplan.com/?nevis`   | Nevis maps and wayfinding                   |

I deployed these application links on 16 November 2026. Use the same query on localhost to review later changes before publishing.

The selected story changes the headline, introductory copy, main action, featured preview and document title. The rest of Kim's career and work stays accessible. Hilo appears with the work whenever it is not the headline feature. Available independent concepts are not duplicated in both places.

`?highlight=hilo` is an alternative spelling. Tracking parameters can coexist, for example `?utm_source=email&hilo`. If several recognised keys are supplied, the first wins. Unknown keys and unbuilt stories show the general portfolio. Only registered stories can supply text, images or destinations; URL values are never rendered as copy or used as arbitrary links.

## My XPS concept

`?xps` leads with my independent retirement-request prototype at `/xps/`. Hilo remains in the work list. `?hilo` leads with Hilo and places XPS among the independent concepts. The neutral portfolio includes both concepts with the work.

I keep XPS’s brief, shared reference, decisions, research plan and validation in `docs/xps/`. The prototype uses fictional data and supplied samples; it does not submit anything to XPS.

## Add another concept

1. Build its actual prototype and add a preview image.
2. Add an entry to `public/highlights.mjs`, following XPS or Hilo: `name`, `kind: 'concept'`, `eyebrow`, two-line `title`, `summary`, `caption`, `status`, `href`, `image`, `imageAlt` and `action`.
3. Use `ready: false` until the prototype and copy can be reviewed. Unavailable entries fall back to the general portfolio.
4. Add the new route to the highlight test’s allowed route pattern; review its query, the general link and the existing concept links on desktop and mobile.
5. Deploy only after approval.

The same registry supports later application-specific concepts. Keep the slug short, stable and lowercase. Do not register a company name until its real prototype and content are available.
