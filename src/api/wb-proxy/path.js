export default async function handler(req, res) {
  const base = (
    process.env.WB_API_BASE_URL || "http://109.73.206.144:6969/api"
  ).replace(/\/+$/, "");
  const key = process.env.WB_API_KEY || "";

  const segments = req.query.path || [];
  const targetPath = Array.isArray(segments) ? segments.join("/") : segments;
  const url = new URL(`${base}/${targetPath}`);

  // copy all query params except our catch-all 'path' and any 'key'
  for (const [k, v] of Object.entries(req.query)) {
    if (k === "path" || k === "key") continue;
    if (Array.isArray(v)) v.forEach((val) => url.searchParams.append(k, val));
    else url.searchParams.append(k, v);
  }
  if (key) url.searchParams.set("key", key);

  try {
    const r = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });
    const text = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
