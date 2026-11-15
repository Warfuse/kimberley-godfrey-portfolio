import { DurableObject } from "cloudflare:workers";
import contexts from "./contexts.json";
import system from "./system.json";
import { validateReport, reserveBudget, limitedJSON } from "./policy.mjs";
const HOSTS = new Set([
  "amaplan.com",
  "www.amaplan.com",
  "kimberley-godfrey-portfolio.warrick-da9.workers.dev",
]);
const json = (data, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    },
  });
function enabled(env) {
  return !!env.ANTHROPIC_API_KEY && Number(env.AI_ENABLED_UNTIL) > Date.now();
}
async function signature(env, origin, bucket) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env.ANTHROPIC_API_KEY || "disabled"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return [
    ...new Uint8Array(
      await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(`${origin}:${bucket}`),
      ),
    ),
  ]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
async function validToken(request, env) {
  const given = request.headers.get("X-Portfolio-Token") || "",
    origin = new URL(request.url).origin,
    bucket = Math.floor(Date.now() / 1800000);
  for (const b of [bucket, bucket - 1]) {
    const expected = await signature(env, origin, b);
    if (given.length !== expected.length) continue;
    let diff = 0;
    for (let i = 0; i < given.length; i++)
      diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff === 0) return true;
  }
  return false;
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url),
      local =
        env.LOCAL_DEVELOPMENT === "1" &&
        ["localhost", "127.0.0.1"].includes(url.hostname);
    if (!HOSTS.has(url.hostname) && !local)
      return json({ error: "Not found." }, 404);
    if (
      url.hostname === "www.amaplan.com" ||
      (url.hostname === "amaplan.com" && url.protocol !== "https:")
    ) {
      url.hostname = "amaplan.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname.startsWith("/hilo/connect"))
      return json({ error: "Not found." }, 404);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (request.method === "GET" && url.pathname === "/api/status")
      return json({
        connected: enabled(env),
        csrf: await signature(
          env,
          url.origin,
          Math.floor(Date.now() / 1800000),
        ),
        syntheticOnly: true,
      });
    if (request.method !== "POST" || url.pathname !== "/api/summary")
      return json({ error: "Not found." }, 404);
    if (
      request.headers.get("Origin") !== url.origin ||
      request.headers.get("Sec-Fetch-Site") === "cross-site" ||
      !(await validToken(request, env))
    )
      return json({ error: "Open the summary from this portfolio." }, 403);
    if (!request.headers.get("content-type")?.startsWith("application/json"))
      return json({ error: "Choose a sample history." }, 415);
    let body;
    try {
      body = await limitedJSON(request);
    } catch {
      return json({ error: "Choose a sample history." }, 400);
    }
    if (
      !body ||
      Array.isArray(body) ||
      Object.keys(body).some((k) => !["scenario", "question"].includes(k))
    )
      return json({ error: "Fictional sample histories only." }, 400);
    if (body.scenario === "urgent")
      return json({ error: "This example does not support summaries." }, 422);
    const question = body.question ?? "summary";
    if (
      typeof body.scenario !== "string" ||
      typeof question !== "string" ||
      !Object.hasOwn(contexts, body.scenario + ":" + question)
    )
      return json({ error: "Choose a supported sample history." }, 400);
    if (!enabled(env))
      return json({ error: "Summary temporarily unavailable." }, 503);
    try {
      return await env.HILO_REPORTS.getByName(
        "portfolio-summary-budget",
      ).summary(body.scenario + ":" + question);
    } catch {
      return json({ error: "Summary temporarily unavailable." }, 503);
    }
  },
};
export class HiloReports extends DurableObject {
  async summary(sample) {
    // Cache only fixed fictional scenarios. No IP addresses, user prompts or health records stored.
    if (!Object.hasOwn(contexts, sample))
      return json({ error: "Unsupported sample." }, 400);
    const key = `${this.env.DATA_VERSION}:${this.env.ANTHROPIC_MODEL}:${sample}`,
      now = Date.now();
    const decision = await this.ctx.storage.transaction(async (tx) => {
      const traffic = (await tx.get("traffic")) || { minute: 0, count: 0 },
        minute = Math.floor(now / 60000);
      const count = traffic.minute === minute ? traffic.count + 1 : 1;
      if (count > 90) return { limit: true };
      await tx.put("traffic", { minute, count });
      const cached = await tx.get("report:" + key);
      if (cached) return { cached };
      if (((await tx.get("pending:" + key)) || 0) > now)
        return { pending: true };
      const budget = reserveBudget(await tx.get("budget"), now);
      if (!budget) return { limit: true };
      await tx.put("budget", budget);
      await tx.put("pending:" + key, now + 65000);
      return { reserved: true };
    });
    if (decision.limit || decision.pending)
      return json({ error: "Please try again shortly." }, 429);
    if (decision.cached) return json({ ...decision.cached, cached: true });
    try {
      if (!enabled(this.env))
        return json({ error: "Summary temporarily unavailable." }, 503);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: AbortSignal.timeout(45000),
        headers: {
          "content-type": "application/json",
          "x-api-key": this.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.env.ANTHROPIC_MODEL,
          max_tokens: 1200,
          system,
          messages: [
            { role: "user", content: JSON.stringify(contexts[sample]) },
          ],
        }),
      });
      if (!response.ok) {
        await response.body?.cancel();
        return json({ error: "Summary temporarily unavailable." }, 503);
      }
      const output = await limitedJSON(response, 65536);
      let raw = output.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (raw.startsWith("```"))
        raw = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
      const report = validateReport(JSON.parse(raw)),
        result = {
          source: "claude",
          model: output.model,
          report,
          generatedAt: new Date().toISOString(),
          cached: false,
        };
      await this.ctx.storage.put("report:" + key, result);
      return json(result);
    } catch {
      return json({ error: "Summary temporarily unavailable." }, 503);
    } finally {
      await this.ctx.storage.delete("pending:" + key);
    }
  }
}
