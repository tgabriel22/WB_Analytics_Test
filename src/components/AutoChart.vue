<template>
  <div class="card">
    <div class="flex flex-wrap gap-3 items-end mb-4">
      <div>
        <label class="text-xs block mb-1">X (group by)</label>
        <select
          v-model="xField"
          class="rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        >
          <option v-for="k in allKeys" :key="k" :value="k">{{ k }}</option>
        </select>
      </div>
      <div>
        <label class="text-xs block mb-1">Y (sum)</label>
        <select
          v-model="yField"
          class="rounded border px-3 py-2 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        >
          <option v-for="k in numeric" :key="k" :value="k">{{ k }}</option>
        </select>
      </div>
    </div>

    <div class="h-[500px]">
      <Bar v-if="chartData" :data="chartData" :options="options" />
      <div v-else class="text-zinc-500 text-sm">
        Pick fields to build a chart.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getAllKeys,
  numericKeys,
  groupAndAggregate,
  normalizeDateStr,
} from "@/utils/dataHelpers";
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps({ rows: { type: Array, default: () => [] } });

const allKeys = computed(() => getAllKeys(props.rows));
const numeric = computed(() => numericKeys(props.rows));

const xField = ref(allKeys.value[0]);
const yField = ref(numeric.value[0]);

watch(allKeys, () => {
  if (!xField.value) xField.value = allKeys.value[0];
});
watch(numeric, () => {
  if (!yField.value) yField.value = numeric.value[0];
});

/* --- DARK/LIGHT THEME AWARE COLORS --- */
const isDark = ref(
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
);
let mql, onChange;
onMounted(() => {
  if (window.matchMedia) {
    mql = window.matchMedia("(prefers-color-scheme: dark)");
    onChange = (e) => (isDark.value = e.matches);
    mql.addEventListener
      ? mql.addEventListener("change", onChange)
      : mql.addListener(onChange);
  }
});
onBeforeUnmount(() => {
  if (mql && onChange) {
    mql.removeEventListener
      ? mql.removeEventListener("change", onChange)
      : mql.removeListener(onChange);
  }
});

const theme = computed(() =>
  isDark.value
    ? {
        axis: "#e5e7eb", // zinc-200
        grid: "rgba(255,255,255,.10)",
        barBg: "rgba(99,102,241,.65)", // indigo-500
        barBorder: "rgba(99,102,241,1)",
      }
    : {
        axis: "#374151", // gray-700
        grid: "rgba(0,0,0,.08)",
        barBg: "rgba(37,99,235,.55)", // blue-600
        barBorder: "rgba(37,99,235,1)",
      }
);

/* --- DATA --- */
const chartData = computed(() => {
  if (!xField.value || !yField.value) return null;
  const { labels, values } = groupAndAggregate(
    props.rows,
    xField.value,
    yField.value
  );
  const normalized = labels.map(normalizeDateStr);
  return {
    labels: normalized,
    datasets: [
      {
        label: `${yField.value} by ${xField.value}`,
        data: values,
        backgroundColor: theme.value.barBg,
        borderColor: theme.value.barBorder,
        borderWidth: 1,
      },
    ],
  };
});

/* --- OPTIONS --- */
const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: { color: theme.value.axis },
      grid: { color: theme.value.grid },
    },
    y: {
      beginAtZero: true,
      ticks: { color: theme.value.axis },
      grid: { color: theme.value.grid },
    },
  },
  plugins: {
    legend: { position: "top", labels: { color: theme.value.axis } },
    title: { display: false },
  },
}));
</script>
