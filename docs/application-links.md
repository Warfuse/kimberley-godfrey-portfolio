# Choose the opening story with a portfolio link

The URL chooses the lead story without changing everyone else's portfolio. No login, cookie, API call or saved personalisation is needed. A refresh or copied link keeps the same choice.

| Link                           | Opening story                               |
| ------------------------------ | ------------------------------------------- |
| `https://amaplan.com/`         | General portfolio; Hilo is in the work list |
| `https://amaplan.com/?hilo`    | Independent Hilo concept                    |
| `https://amaplan.com/?royal`   | Royal London employer website               |
| `https://amaplan.com/?braze`   | Braze knowledge pages and sales tools       |
| `https://amaplan.com/?capital` | Express Capital pitched calculator          |
| `https://amaplan.com/?fuse`    | Fuse brand system                           |
| `https://amaplan.com/?nevis`   | Nevis maps and wayfinding                   |

These routes describe the implemented local change. They take effect on the live domain only after deployment. Use the same query on localhost to review them first.

The selected story changes the headline, introductory copy, main action, featured preview and document title. The rest of Kim's career and work stays accessible. Hilo appears with the work whenever it is not the headline feature. Available independent concepts are not duplicated in both places.

`?highlight=hilo` is an alternative spelling. Tracking parameters can coexist, for example `?utm_source=email&hilo`. If several recognised keys are supplied, the first wins. Unknown keys and unbuilt stories show the general portfolio. Only registered stories can supply text, images or destinations; URL values are never rendered as copy or used as arbitrary links.

## Add XPS when the prototype is ready

XPS is reserved in `public/highlights.mjs` with `ready: false`. **`?xps` currently shows the general portfolio**, with Hilo in the normal work list. It does not invent XPS work or send a recruiter to an empty prototype.

1. Build the actual prototype, for example `public/prototypes/xps.html`.
2. Replace the reserved `xps` entry in `public/highlights.mjs` with the same fields as Hilo: `name`, `kind: 'concept'`, `eyebrow`, two-line `title`, `summary`, `caption`, `status`, `href`, `image`, `imageAlt` and `action`.
3. Remove `ready: false` or change it to `true`. Keep the first-person claims and project status accurate.
4. Review `/?xps`, `/?hilo` and `/` on desktop, mobile and keyboard; run the repository checks.
5. Deploy only after approval. Kim can then share `https://amaplan.com/?xps`.

The generic renderer automatically promotes XPS and moves Hilo into the work list. XPS also appears among the independent concepts when another story leads. No renderer edit is needed.

The same registry supports later application-specific concepts. Keep the slug short, stable and lowercase. Do not register a company name until its real prototype and content are available.
