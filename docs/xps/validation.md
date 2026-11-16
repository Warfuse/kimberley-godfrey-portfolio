# XPS validation

## Executable checks

`tests/xps-case.test.mjs` checks the actual shared state model: valid progression, next-owner states, immutable transitions, blocking skipped steps, rejecting unknown fixtures, preventing acceptance of an unreadable sample, and returning/replacing a sample within the same case.

Repository checks also cover first-party JavaScript syntax, local HTML/CSS assets, formatting, credential patterns and the Cloudflare dry-run build. These checks need no key and do not publish.

## Manual review record

Local checks on 16 November 2026 covered:

- Member selection, required-choice error focus, review, change-sample retention and explicit submission.
- Administrator required-decision validation, acceptance and the member’s resulting status.
- Unreadable fixture blocked from acceptance, request-for-clearer-sample loop, replacement and successful review.
- Optional final sample update, modal open/close and download of the fictional text summary.
- Help dialog dismissal with Escape and focus return.
- Member/Administrator Arrow, Home and End keyboard navigation; sample selection, review, send and acceptance activated with keyboard actions.
- Desktop 1280px and mobile 390px layouts with no horizontal overflow or broken images observed.
- System reduced-motion styling and the page’s manual motion control.
- `?xps` highlights XPS with Hilo in the work list; `?hilo` highlights Hilo with XPS in the list.

The expected filename and fictional content of the downloaded text summary were inspected locally. Relevant text-token colour pairs are checked against a 4.5:1 contrast threshold in the model test file. These checks do not establish full accessibility conformance.

Formal WCAG conformance, real screen-reader validation, user research, identity verification, pension-policy review and business outcomes are not claimed.

## Release scope

I first built and reviewed this locally, then deployed it with owner approval on 16 November 2026. The live `?xps` link leads with XPS and keeps Hilo in the work list. The `?hilo` link does the reverse. The live member-to-administrator path reached the final state with all four progress milestones complete. Both domain names preserve the query and route to HTTPS. The existing CV downloads and Hilo connection remained available; no new AI generation was needed for these checks.
