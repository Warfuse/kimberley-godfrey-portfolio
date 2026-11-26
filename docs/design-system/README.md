# Shared design-system reference

This is the agreed reference for this portfolio. The values below are indexed from the implementation; CSS remains the executable source. Do not create a separate competing palette in prompts or new components.

## Portfolio foundation

| Token / rule   | Value or source                                                                     | Purpose                                               |
| -------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Canvas         | `#f5f2eb` · `public/style.css` body                                                 | Warm, quiet background                                |
| Main ink       | `#222b26` · body                                                                    | Primary text and controls                             |
| Focus          | `#2448d1`, 3px outline, 6px offset                                                  | Keyboard location                                     |
| Typography     | Local Avenir Next when installed, Segoe UI, Arial, sans-serif; system serif accents | No remote font dependency for the portfolio           |
| Page structure | `public/style.css`                                                                  | Hero, project board, modal and responsive composition |
| AI method      | `public/ai-workflow.css`                                                            | Workflow diagram and environment tabs                 |
| Career         | `public/career.css`                                                                 | Evidence summary, dates, logos and CV actions         |

The Hilo concept has its own brand context in `public/hilo/hilo.css`, with locally bundled Inter and its OFL notice. Source-screen replays retain original artwork rather than restyling historic UI to match this portfolio.

## Components and rules

- **Project card:** project name, plain-language contribution, status and an accessible button name. The quick-scan view offers the same destinations.
- **Case-study dialog:** descriptive title, close action, project navigation, source-backed imagery and bounded prototype links. Preserve focus behaviour when editing.
- **AI environment tabs:** one selected tab, associated panel, arrow/Home/End navigation. Context changes with the selected environment; the design reference remains shared.
- **Career row:** dates and optional official logo beside text employer, role and contribution. Logos are decorative because the employer name is already text.
- **CV action:** direct download and a separate PDF view link; do not route it through an account or form.
- **Hilo guide:** non-blocking scenario → explanation → summary prompts with dismiss/restart controls. A failed AI call offers an explicitly prewritten sample.

- **Application highlight:** `public/highlights.mjs` is the shared content and route registry; `public/highlight-story.mjs` renders it. `public/highlight-story.css` extends the existing visual system. Keep first-person copy, a direct working-prototype link and accurate status. Unfeatured concepts remain with the work; unavailable entries use the neutral portfolio.

- **XPS concept:** `docs/xps/design-reference.md` records my use of the official public logo and palette, accessible colour choices and connected-service patterns. `public/xps/case-model.mjs` is the one shared case model behind both views. I do not claim to implement XPS’s internal design system.

## Accessibility and motion

Use semantic links for navigation and buttons for actions. Keep visible focus, descriptive labels, headings and captions. Do not rely on colour alone for map routes or state. Respect `prefers-reduced-motion` and the portfolio motion toggle; keep keyboard controls available for visual interactions. Avoid adding essential information only on hover.

Review responsive changes at approximately 390px and 1280px and with zoom. Manual checks are necessary; an automated pass does not establish WCAG compliance. New tokens or component changes should update this reference and their actual CSS together.

- **Airalo showcase:** [the shared reference](../airalo/design-reference.md) maps my original screenshot states to the editorial replay. The original cards remain unchanged; showcase tokens live in `public/airalo/airalo.css` and state content in `public/airalo/journey.mjs`.

- **Research toolkit:** the `#toolkit` section reuses the career layout, strengths list and project link. Keep tool claims tied to documented work; label prospective tools separately. Preserve the same responsive and focus rules as the career section.
