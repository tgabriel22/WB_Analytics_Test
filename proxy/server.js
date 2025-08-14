import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "OPTIONS"] }));

const BASE = (
  process.env.WB_API_BASE_URL || "http://109.73.206.144:6969/api"
).replace(/\/+$/, "");
const SERVER_KEY = process.env.WB_API_KEY || "";

app.get("/wb-proxy/*", async (req, res) => {
  try {
    const path = req.params[0] || "";
    const url = new URL(`${BASE}/${path}`);
    // copy client query params
    for (const [k, v] of Object.entries(req.query)) {
      Array.isArray(v)
        ? v.forEach((val) => url.searchParams.append(k, val))
        : url.searchParams.append(k, v);
    }
    // if client didn't pass key, fall back to server env key
    if (!url.searchParams.has("key") && SERVER_KEY) {
      url.searchParams.set("key", SERVER_KEY);
    }

    const r = await fetch(url, { headers: { accept: "application/json" } });
    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.get("/ping", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 10000, () => {
  console.log("Proxy listening on", process.env.PORT || 10000);
});
