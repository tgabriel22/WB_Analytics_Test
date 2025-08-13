<template>
  <div class="card">
    <div class="overflow-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="bg-zinc-100 dark:bg-zinc-800 sticky top-0">
            <th
              v-for="col in columns"
              :key="col"
              class="text-left px-3 py-2 font-semibold whitespace-nowrap"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in filteredRows"
            :key="idx"
            class="border-t border-zinc-100 dark:border-zinc-800"
          >
            <td v-for="col in columns" :key="col" class="px-3 py-2 align-top">
              <span v-if="typeof row[col] === 'object' && row[col] !== null">
                {{ JSON.stringify(row[col]) }}
              </span>
              <span v-else>{{ row[col] }}</span>
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td
              :colspan="columns.length"
              class="px-3 py-6 text-center text-zinc-500"
            >
              No data
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { getAllKeys } from "@/utils/dataHelpers";

const props = defineProps({
  rows: { type: Array, default: () => [] },
  term: { type: String, default: "" },
});

const columns = computed(() => getAllKeys(props.rows));
const filteredRows = computed(() => {
  const t = props.term?.toLowerCase().trim();
  if (!t) return props.rows;
  return props.rows.filter((r) =>
    Object.values(r ?? {}).some((v) => String(v).toLowerCase().includes(t))
  );
});
</script>
