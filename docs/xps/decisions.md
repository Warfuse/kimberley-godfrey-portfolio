# My design decisions

## I chose a handoff rather than a whole dashboard

The role spans member and administrator experiences. I chose one task across both views so a reviewer can see end-to-end reasoning without navigating a large invented platform. My Royal London navigation work and Braze internal-tool work provide relevant background; this is a new independent idea, not work delivered for XPS.

## I made the next owner explicit

I pair each status with who acts next and why. I do not invent an expected completion date, imply that a submitted document is already approved or tell the member to repeat a task while it is under review.

## I keep one shared case model

`public/xps/case-model.mjs` contains the states, fixture metadata, permitted transitions, progress and next-owner copy. The UI derives both perspectives from that model. An administrator's decision changes the same case the member sees. A role switch alone never changes the case.

## I included an exception route

A perfect happy path would miss a useful service-design problem. I include a fixture marked unreadable and a request-for-clearer-information loop. I prevent confirmation of that fixture, explain the correction and keep the request open. This is not OCR or a judgement on a real document.

## I use explicit sample actions

I do not simulate an upload by accepting a real file. I provide named fixtures, a review screen and an explicit send action. No personal data leaves the browser, and nothing is persisted after a refresh. The optional download is a fictional text update, not a pension quotation.

## I keep AI in the design workflow

I used AI coding assistance to implement this prototype from a documented brief and shared reference. I do not add a pension-advice chatbot to the member journey: this task can be demonstrated with deterministic states and clear content. No AI service or paid credential is required for XPS.

## I separate prototype output from proven impact

My output is a working connected demo. Better understanding, fewer incomplete submissions and fewer status enquiries are hypotheses for research, not delivered business outcomes. The public sources inform the opportunity; they do not establish an observed usability failure in XPS's private products.
