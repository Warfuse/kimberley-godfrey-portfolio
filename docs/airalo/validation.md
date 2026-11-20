# Airalo local validation

The source-integrity tests compare all twelve copied originals against their recorded SHA-256 hashes. The journey tests check state values, next/previous boundaries, restart and invalid-state fallback. Highlight tests verify that `?airalo` promotes the Airalo showcase while keeping Hilo and XPS in the concepts list.

Manual browser review and repository checks are recorded below once completed. This is a portfolio replay of supplied captures; no live wallet or Airalo account integration is being tested.

## Manual review — 20 November 2026

Reviewed locally in the in-app browser at 1280 × 900 and 390 × 844. Both layouts had no horizontal overflow. The hero, labelled state navigation, card image and explanation remained readable. All seven state buttons selected the expected state. Arrow, Home and End navigation worked; the final action restarted the journey. The original-image dialog opened, closed with Escape and restored focus to its opening button. The gallery contained all twelve originals; its final source image also opened correctly. The manual motion control updated its pressed state. No browser console errors were observed.

The initial review showed an Airalo headline; this was corrected after owner feedback to preserve my main introduction and customise only the featured showcase. `?hilo` and `?xps` retained Airalo in their lower concepts list. Desktop screenshots were saved outside the public assets for local review.

`npm test`, `npm run check` and the local dry-run build passed. The tests include checksums for all twelve source images, sample-value consistency, navigation boundaries and application-link routing. These checks do not establish real-wallet functionality, user outcomes or formal accessibility conformance.

## Published review — 20 November 2026

Published after owner approval. Verified `https://amaplan.com/?airalo` in the browser: the featured showcase beneath my unchanged introduction leads to my Airalo demo, and Hilo/XPS remain lower among the concepts. The `https://www.amaplan.com/?airalo` link redirects to the apex while retaining the query. The live showcase opened and switched to the top-up state with 5.8 GB, four days and US$3.20, without browser console errors. The live journey module matches the repository source, and both existing PDF downloads match their preserved release copies byte-for-byte. No paid AI generation was needed for this release check.
