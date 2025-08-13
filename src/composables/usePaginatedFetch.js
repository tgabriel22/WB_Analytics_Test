import { ref, watch, computed } from "vue";
import { format } from "date-fns";
import api from "@/api/client";
import { asArray, extractMeta } from "@/utils/dataHelpers";

export default function usePaginatedFetch(endpoint, initial = {}) {
  const isStocks = computed(() => endpoint === "stocks");
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const loading = ref(false);
  const error = ref(null);
  const rows = ref([]);
  const page = ref(initial.page ?? 1);
  const limit = ref(initial.limit ?? 50);
  const dateFrom = ref(
    initial.dateFrom ??
      (isStocks.value
        ? todayStr
        : format(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"))
  );
  const dateTo = ref(
    initial.dateTo ??
      (isStocks.value ? todayStr : format(new Date(), "yyyy-MM-dd"))
  );
  const meta = ref({ current: 1, last: null, perPage: null, total: null });
  const extra = ref(initial.extra ?? {});
  const term = ref("");

  async function fetchPage(newPage = page.value) {
    loading.value = true;
    error.value = null;
    try {
      const params = { page: newPage, limit: limit.value };

      if (isStocks.value) {
        // enforce current day
        params.dateFrom = todayStr;
        dateFrom.value = todayStr;
      } else {
        params.dateFrom = dateFrom.value;
        params.dateTo = dateTo.value;
      }

      Object.assign(params, extra.value);
      const { data } = await api.get(`/${endpoint}`, { params });
      rows.value = asArray(data);
      meta.value = extractMeta(data);
      page.value = meta.value.current ?? newPage;
    } catch (e) {
      error.value = e?.message ?? String(e);
      rows.value = [];
    } finally {
      loading.value = false;
    }
  }

  function setPage(p) {
    if (p < 1) return;
    if (meta.value.last && p > meta.value.last) return;
    page.value = p;
    fetchPage(p);
  }

  function setLimit(l) {
    limit.value = l;
    setPage(1);
  }

  // auto-refetch on date/limit change (no dateTo for stocks)
  watch([dateFrom, dateTo], () => {
    if (!isStocks.value) setPage(1);
  });
  watch(limit, () => setPage(1));

  return {
    loading,
    error,
    rows,
    page,
    limit,
    dateFrom,
    dateTo,
    meta,
    term,
    extra,
    fetchPage,
    setPage,
    setLimit,
  };
}
