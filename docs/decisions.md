# Design and engineering decisions

These records describe the current implementation, rather than a fabricated history of the original client projects.

## 01 · Lead with role, action and result

**Problem:** abstract headlines and long explanations make it difficult for a hiring manager to identify my contribution.

**Decision:** use direct first-person statements, delivery labels and a quick-scan route. Keep deeper evidence inside each case study. **Tradeoff:** concise summaries cannot express every collaborator or constraint; the case study provides context without inventing missing metrics.

## 02 · Replay original work where fidelity matters

**Problem:** a newly invented interface could misrepresent historic Royal London or Braze work.

**Decision:** link original screens through a source-based replay and expose high-resolution individual exports. **Tradeoff:** unsupplied screens and proprietary ROI calculations remain unavailable. I prefer a clear boundary over a fictitious delivered result.

## 03 · One shared reference across AI environments

**Problem:** changing tools or prompts can produce inconsistent visual decisions.

**Decision:** keep brief, design-system reference, original evidence and review decisions together in Git. **Tradeoff:** the reference needs maintenance whenever CSS or components change. It describes this portfolio workflow, not a retroactive claim about every past project.

## 04 · Bounded AI explanation, never triage

**Problem:** a data-rich health display may not help a person prepare a useful conversation.

**Decision:** explore summaries of fictional patterns with explicit uncertainty and GP questions. Use server-side secrets, allowlisted contexts, cached replies, expiry and hard generation-attempt limits. **Tradeoff:** no free-text medical questions or real records; output safety still requires review and is not clinically validated.

## 05 · Creative navigation with direct alternatives

**Problem:** exploratory motion and 3D can make important information harder to reach.

**Decision:** retain quick scan, semantic controls, keyboard paths, reduced motion and flat map originals. **Tradeoff:** the 3D scene is an illustrative portfolio interaction, not a geographic navigation product.

## 06 · Manual production publishing

**Problem:** a public portfolio repo should not give pull requests access to hosting credentials or accidentally spend an owner's API budget.

**Decision:** run read-only CI checks without secrets. Keep production configuration local and require an explicit deploy. Default clones disable AI. **Tradeoff:** publishing is a deliberate owner action rather than an automatic push-to-deploy workflow.

## 07 · Tailor the lead story with a shareable URL

**Problem:** Kim needs to emphasise relevant work for different applications without maintaining separate copies of her portfolio.

**Decision:** use allowlisted query keys and one shared story registry. The URL controls the opening copy and feature, while the rest of the work remains available. Hilo moves into the normal work list when another story leads. **Tradeoff:** unavailable entries fall back to the general portfolio; the working XPS concept now has its own route. No cookies or arbitrary query-generated content are needed.

## 08 · My XPS connected request

I designed one fictional member-to-administrator handoff with a shared case model, sample-only submission and a correction loop. My reasoning, XPS brand reference and proposed research are documented in `docs/xps/`. I use deterministic state transitions rather than introducing AI or financial calculations into this task.

## Airalo: preserve my card work and credit the platform

I made the local application showcase a source-backed replay of my twelve original captures. I created the use case, card design and graphics and built the demo on Fuse Wallet. I separate that platform build from the portfolio replay, preserve the sample values, and avoid implying a commissioned Airalo launch or measured commercial results. `?airalo` promotes this work only in the featured showcase beneath my unchanged introduction, while keeping Hilo and XPS available below. See [my Airalo brief](airalo/README.md).
