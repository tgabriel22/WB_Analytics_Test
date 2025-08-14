export default async function handler(req, res) {
  const base = (
    process.env.VITE_API_BASE_URL || "http://109.73.206.144:6969/api"
  ).replace(/\/+$/, "");
  const key = process.env.VITE_API_KEY || "";

  const segs = req.query.path || [];
  const target = Array.isArray(segs) ? segs.join("/") : segs;
  const url = new URL(`${base}/${target}`);

  for (const [k, v] of Object.entries(req.query)) {
    if (k === "path" || k === "key") continue;
    Array.isArray(v)
      ? v.forEach((val) => url.searchParams.append(k, val))
      : url.searchParams.append(k, v);
  }
  if (key) url.searchParams.set("key", key);

  try {
    const r = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    const text = await r.text();

    // 🔒 tell the browser/CDN NOT to cache this function response
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
