# My XPS design reference

This is the shared reference for this concept. `public/xps/xps.css` holds the executable tokens; I update the reference with material changes rather than inventing a separate palette in each prompt.

## My use of the public XPS brand

I inspected XPS's public site on 16 November 2026. Its public CSS uses deep blue `#00338d`, cyan `#00a9e0`, white and grey `#f0f3f6`, with other accent colours. I use those as the starting point for an independent concept; I am not claiming to implement XPS's internal design system.

- Original logo: https://www.xpsgroup.com/application/images/logo.svg
- Public stylesheet inspected: https://www.xpsgroup.com/application/themes/design_portfolio/css/theme.css
- Public site: https://www.xpsgroup.com/

I retain the official SVG geometry and colours. XPS's site references Gotham, but I do not redistribute that commercial font. I use the already bundled Inter font and its existing SIL OFL notice at `public/hilo/assets/INTER-OFL.txt`.

## My token choices

| Token                    | Value                 | My use                                            |
| ------------------------ | --------------------- | ------------------------------------------------- |
| `--blue`                 | `#00338d`             | Primary actions, focus, selected tab and headings |
| `--cyan`                 | `#00a9e0`             | Decorative brand accent, not small text on white  |
| `--ink`                  | `#243746`             | Main text                                         |
| `--muted`                | `#526571`             | Supporting text                                   |
| `--canvas`               | `#f0f3f6`             | Demo background                                   |
| `--soft-blue`            | `#eaf1fc`             | Guidance and contextual surfaces                  |
| `--green` / `--green-bg` | `#285d38` / `#edf5e8` | Completion, paired with text and a check symbol   |
| `--amber` / `--amber-bg` | `#805100` / `#fff5dc` | Action needed, paired with an explicit label      |

## My reusable patterns

- **Perspective tabs:** a labelled tablist, selected state, associated panel and Arrow/Home/End keys. This is a demo switch, not a real access-control mechanism.
- **Case status:** the model's stage determines the labels, progress and next owner for both views. I adapt explanation to the audience while preserving one underlying state.
- **Task card:** reason, required action, next owner and a prominent control together.
- **Sample choice:** native radio inputs inside clickable labels. I provide clear and unreadable fixtures without processing real documents.
- **Review step:** read-only sample summary before an explicit send action.
- **Errors:** a focused summary with a specific correction; no silent advancement.
- **History:** an ordered record shared by both views; no fabricated turnaround times.
- **Help:** an accessible dialog with an alternative human-support explanation. It does not make a call or supply invented contact details.

I use visible blue focus outlines, native dialog behaviour and descriptive labels. Motion is decorative and disabled by system preference or the page control. Colour alone never conveys progress. Automated and manual checks are described in `validation.md`; I do not claim a formal accessibility certification.
