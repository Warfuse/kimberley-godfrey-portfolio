export function validateReport(data) {
  const fields = [
    "headline",
    "observations",
    "discussion_points",
    "lifestyle_ideas",
    "uncertainty",
  ];
  if (
    !data ||
    Array.isArray(data) ||
    Object.keys(data).sort().join() !== fields.sort().join()
  )
    throw Error("Invalid report");
  for (const k of ["headline", "uncertainty"])
    if (
      typeof data[k] !== "string" ||
      data[k].length < 1 ||
      data[k].length > 1200
    )
      throw Error("Invalid report");
  for (const k of ["observations", "discussion_points", "lifestyle_ideas"])
    if (
      !Array.isArray(data[k]) ||
      data[k].length > 4 ||
      data[k].some((v) => typeof v !== "string" || !v.length || v.length > 900)
    )
      throw Error("Invalid report");
  if (!data.observations.length || !data.discussion_points.length)
    throw Error("Incomplete report");
  const text = JSON.stringify(data).toLowerCase();
  if (
    text.includes("<script") ||
    /you (?:have|are diagnosed with) (?:nocturnal hypertension|sleep apn|hypertension)/.test(
      text,
    ) ||
    /(?:stop|start|increase|decrease|change|double) your (?:medication|medicine|dose)/.test(
      text,
    )
  )
    throw Error("Unsafe report");
  return data;
}
export function reserveBudget(previous = {}, now = Date.now()) {
  const day = new Date(now).toISOString().slice(0, 10),
    month = day.slice(0, 7),
    minute = Math.floor(now / 60000);
  const next = {
    day,
    month,
    minute,
    daily: previous.day === day ? previous.daily : 0,
    monthly: previous.month === month ? previous.monthly : 0,
    requests: previous.minute === minute ? previous.requests : 0,
  };
  if (next.daily >= 12 || next.monthly >= 40) return null;
  next.daily++;
  next.monthly++;
  return next;
}
export async function limitedJSON(request, maxBytes = 2048) {
  if (Number(request.headers.get("content-length") || 0) > maxBytes)
    throw Error("Too large");
  const reader = request.body?.getReader();
  if (!reader) throw Error("Missing body");
  let total = 0;
  const parts = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw Error("Too large");
      }
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
