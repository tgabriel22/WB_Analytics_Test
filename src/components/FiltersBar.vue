<template>
  <div class="card mb-4">
    <div class="grid md:grid-cols-5 gap-3">
      <div class="col-span-2">
        <label class="text-xs block mb-1">Date From</label>
        <input
          type="date"
          v-model="dateFrom"
          class="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        />
      </div>
      <div class="col-span-2" v-if="!stocks">
        <label class="text-xs block mb-1">Date To</label>
        <input
          type="date"
          v-model="dateTo"
          class="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        />
      </div>
      <div class="col-span-1">
        <label class="text-xs block mb-1">Rows per page</label>
        <select
          v-model.number="limit"
          class="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        >
          <option v-for="n in [25, 50, 100, 200, 500]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div class="md:col-span-5">
        <label class="text-xs block mb-1"
          >Search (client-side on current page)</label
        >
        <input
          type="text"
          v-model="term"
          placeholder="Type to filter visible rows…"
          class="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  stocks: { type: Boolean, default: false },
  modelValueDateFrom: String,
  modelValueDateTo: String,
  modelValueLimit: Number,
  modelValueTerm: String,
});

const emit = defineEmits([
  "update:dateFrom",
  "update:dateTo",
  "update:limit",
  "update:term",
]);

const dateFrom = computed({
  get: () => props.modelValueDateFrom,
  set: (v) => emit("update:dateFrom", v),
});
const dateTo = computed({
  get: () => props.modelValueDateTo,
  set: (v) => emit("update:dateTo", v),
});
const limit = computed({
  get: () => props.modelValueLimit,
  set: (v) => emit("update:limit", v),
});
const term = computed({
  get: () => props.modelValueTerm,
  set: (v) => emit("update:term", v),
});
</script>
