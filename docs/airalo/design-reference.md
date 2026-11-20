# My Airalo showcase design reference

I use the supplied card graphics and screenshots as the single visual reference for the demo states. I do not redraw the Airalo logo or fabricate another card system.

The surrounding showcase uses Inter from the portfolio’s locally hosted font files, dark teal (`#12313c`), deep teal (`#09242c`), warm white (`#faf8f3`) and coral (`#ff8a76`). Body text uses dark ink (`#172e36`) and muted teal (`#51676d`). These tokens are defined in `public/airalo/airalo.css`.

I organise the page into contribution, interactive journey, design decisions and original screens. Every state has a visible name, sample values, my reason for the choice and a next action. The seven tabs use roving focus and arrow/Home/End keys. Their numbers support order without carrying meaning on their own.

I show the card previews inside a clipped frame for quick comparison, then provide complete unchanged originals in a modal viewer. The viewer supports Escape and returns focus to the opening button. All essential content is available without hover. I respect the operating-system motion preference and provide a manual motion control.

The journey changes from a side navigation at desktop widths to a compact labelled grid on smaller screens. Its screenshot and explanation stack on narrow phones. The original-screen gallery reduces from four columns to two. See validation notes for the actual viewports reviewed.
