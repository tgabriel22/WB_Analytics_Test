export default async function handler(req, res) {
  const base = (
    process.env.WB_API_BASE_URL || "http://109.73.206.144:6969/api"
  ).replace(/\/+$/, "");

  const segs = req.query.path || [];
  const target = Array.isArray(segs) ? segs.join("/") : segs;
  const url = new URL(`${base}/${target}`);

  for (const [k, v] of Object.entries(req.query)) {
    if (k === "path") continue;
    Array.isArray(v)
      ? v.forEach((val) => url.searchParams.append(k, val))
      : url.searchParams.append(k, v);
  }

  if (!url.searchParams.has("key") && process.env.WB_API_KEY) {
    url.searchParams.set("key", process.env.WB_API_KEY);
  }

  try {
    const r = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
