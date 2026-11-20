# My Airalo Wallet showcase

## What I made and why

I created the use case, designed the cards and produced the graphics. I built the experience on Fuse Wallet. I wanted a traveller to see their destination, remaining data, validity and Airmoney together, with a clear card state when something changes.

My audience here is an Airalo hiring manager. The opening states my contribution immediately. The journey then lets them inspect my decisions and original work without reading a long case study first.

## What the reviewer can do

- Open `https://amaplan.com/?airalo` to feature the showcase beneath my unchanged introduction; Hilo and XPS stay lower among the concepts.
- Follow seven sample states: ready, connected, usage, low data, expiry reminder, top-up and Airmoney update.
- Switch directly between states using the labelled buttons or arrow keys.
- Enlarge the complete original screenshots, including the original Fuse Wallet landing capture, in a keyboard-accessible dialog.

## My implementation decisions

I used my supplied screenshots as the visual source. I kept the originals unchanged and recorded their hashes in `source-images.json`. The local browser replay explains their states; it is not a second implementation of the Fuse Wallet platform.

I retained the supplied values. The top-up capture shows 5.8 GB with four days remaining; I do not imply that topping up extends validity. The Airmoney capture changes US$3.20 to US$3.73; I do not derive a rewards formula from that example. I show separate data and time reminders because they represent different information.

I credit my work and the platform separately. This is an application demonstration, without a claim that Airalo commissioned or launched it. The supplied landing image shows Apple and Google Wallet entry points, while the wallet captures demonstrate the iPhone presentation. This replay does not install either pass, activate an eSIM, charge money or send a notification.

## Files and validation

- `public/airalo/journey.mjs`: source-backed state content and transitions.
- `public/airalo/airalo.mjs`: tabs, navigation, image viewer and motion controls.
- `public/airalo/airalo.css`: showcase tokens and responsive layout.
- `tests/airalo-journey.test.mjs`: source integrity, values and journey boundaries.
- [Design reference](design-reference.md) and [validation notes](validation.md).

Publication was authorised on 20 November 2026. The live application link is `https://amaplan.com/?airalo`; Hilo and XPS remain lower in the work list.
