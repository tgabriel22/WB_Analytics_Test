<template>
  <div class="flex items-center justify-between gap-3 text-sm mt-3">
    <div class="text-zinc-500">
      Page <strong>{{ current }}</strong>
      <span v-if="last"
        >of <strong>{{ last }}</strong></span
      >
      <span v-if="total"> • Total: {{ total }}</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
        :disabled="current <= 1"
        @click="$emit('page', current - 1)"
      >
        Prev
      </button>
      <input
        type="number"
        class="w-20 px-2 py-1 rounded border bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
        :value="current"
        min="1"
        :max="last || undefined"
        @change="jump($event)"
      />
      <button
        class="px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
        :disabled="last && current >= last"
        @click="$emit('page', current + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  current: Number,
  last: Number,
  total: Number,
});
const emit = defineEmits(["page"]);
function jump(e) {
  const v = Number(e.target.value || 1);
  if (v >= 1) emit("page", v);
}
</script>
