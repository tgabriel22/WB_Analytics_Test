export function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  return [];
}

export function extractMeta(payload) {
  // Laravel paginator commonly returns meta: { current_page, last_page, per_page, total }
  const meta = payload?.meta ?? {};
  const current = meta.current_page ?? payload?.current_page ?? 1;
  const last =
    meta.last_page ??
    payload?.last_page ??
    (meta.total && meta.per_page
      ? Math.ceil(meta.total / meta.per_page)
      : null);
  const perPage = meta.per_page ?? payload?.per_page ?? null;
  const total = meta.total ?? payload?.total ?? null;
  return { current, last, perPage, total };
}

export function getAllKeys(rows) {
  const keys = new Set();
  rows.forEach((r) => Object.keys(r || {}).forEach((k) => keys.add(k)));
  return [...keys];
}

export function guessDateFields(keys) {
  return keys.filter((k) => /date|time|dt|created|updated/i.test(k));
}

export function numericKeys(rows) {
  const keys = getAllKeys(rows);
  return keys.filter((k) => rows.some((r) => typeof r?.[k] === "number"));
}

export function groupAndAggregate(rows, xField, yField) {
  const grouped = new Map();
  rows.forEach((r) => {
    const x = r?.[xField];
    const y = Number(r?.[yField] ?? 0);
    if (x == null) return;
    grouped.set(x, (grouped.get(x) ?? 0) + (isNaN(y) ? 0 : y));
  });
  const labels = [...grouped.keys()];
  const values = [...grouped.values()];
  return { labels, values };
}

export function normalizeDateStr(s) {
  if (!s) return null;
  // trim to date for labels
  const m = String(s).match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : String(s);
}
