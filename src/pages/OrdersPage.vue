<template>
  <section class="space-y-4">
    <h2 class="text-lg font-semibold">Orders</h2>

    <FiltersBar
      :model-value-date-from="dateFrom"
      :model-value-date-to="dateTo"
      :model-value-limit="limit"
      :model-value-term="term"
      @update:dateFrom="(v) => (dateFrom = v)"
      @update:dateTo="(v) => (dateTo = v)"
      @update:limit="(v) => setLimit(v)"
      @update:term="(v) => (term = v)"
    />

    <AutoChart :rows="rows" />

    <div v-if="error" class="card border border-red-300 text-red-700">
      Error: {{ error }}
    </div>
    <div v-else-if="loading" class="card">Loading…</div>
    <template v-else>
      <SimpleTable :rows="rows" :term="term" />
      <SimplePaginator
        :current="meta.current || page"
        :last="meta.last"
        :total="meta.total"
        @page="setPage"
      />
    </template>
  </section>
</template>

<script setup>
import FiltersBar from "@/components/FiltersBar.vue";
import SimpleTable from "@/components/SimpleTable.vue";
import SimplePaginator from "@/components/SimplePaginator.vue";
import AutoChart from "@/components/AutoChart.vue";
import usePaginatedFetch from "@/composables/usePaginatedFetch";

const {
  loading,
  error,
  rows,
  page,
  limit,
  dateFrom,
  dateTo,
  meta,
  term,
  setPage,
  setLimit,
  fetchPage,
} = usePaginatedFetch("orders");

fetchPage();
</script>
