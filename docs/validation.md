# Validation and practical limits

## Automated checks

`npm test` covers calculator arithmetic, scenario/boundary handling, Hilo guide progression, report validation, request-size limits, daily/monthly generation budgets, cache reuse, concurrent reservations, host/redirect behaviour and API rejection paths. `npm run check` checks syntax, local asset references, formatting, forbidden publication files and common credential patterns. `npm run build` validates the Cloudflare bundle.

CI also runs Gitleaks 8.30.1 over the fetched Git history using a checksum-verified release binary. The initial publication was scanned locally with Gitleaks, including the committed history, and PDF text was checked for provider-key patterns. These checks are additional safeguards, not a guarantee that every confidential detail can be detected.

All run without a live provider key. Stubbed provider responses test coordination, not model accuracy. No clinical, financial or usability outcome is inferred from a passing test.

## Observed portfolio checks · 15 November 2026

The deployed portfolio was checked at desktop and mobile widths, including career logos, CV download, source-based Braze/Royal navigation, AI environment tabs, keyboard paths and reduced-motion controls. HTTP apex/www redirects and HTTPS www were verified to reach https://amaplan.com/; Hilo path/query were preserved. New live assets and CV matched reviewed local files. These are point-in-time checks, not a guarantee for every browser or device.

## Before a UI release

- Inspect around 390px and 1280px and at browser zoom; check text contrast, clipping and image sharpness.
- Navigate with Tab/Shift+Tab, activate dialogs, close with Escape and check focus return.
- Try reduced motion and the motion toggle; retain non-3D paths to original map artwork.
- Switch Claude Code/GPT Work with keyboard; check the shared reference remains clear.
- Follow the Hilo guide, change fictional scenario, view a sample summary and export the fictional GP brief. Treat unavailable AI as a labelled fallback, never a fabricated live response.
- Recheck domain redirects, embeds, CV, headers and API boundaries after deployment.

## Not claimed

No formal WCAG audit, representative user study, production penetration test, clinical validation or verified conversion/revenue improvement is claimed. Original source-image resolution limits remain; individual high-resolution Braze exports are preferred over enlarged montage thumbnails.

## Application-specific highlights · 16 November 2026

Local browser checks covered `?hilo`, `?royal`, the neutral link and the unavailable `?xps` fallback. The selected headline survives refresh; opening/closing a client case study and returning from the Hilo preview preserve the application query. Hilo remains in the work list when another story leads. Desktop 1280px and mobile 390px checks found no horizontal overflow or broken images; no console errors were observed. Direct links to dynamically added concept cards restore their anchor after layout. No production deployment was made for this review.
