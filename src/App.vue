<template>
  <div
    class="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100"
  >
    <header
      class="bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div class="container flex items-center justify-between py-3">
        <h1 class="text-xl font-semibold">WB Analytics (Test)</h1>
        <nav class="flex gap-3 text-sm">
          <RouterLink
            class="px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            to="/sales"
            >Sales</RouterLink
          >
          <RouterLink
            class="px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            to="/orders"
            >Orders</RouterLink
          >
          <RouterLink
            class="px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            to="/stocks"
            >Stocks</RouterLink
          >
          <RouterLink
            class="px-3 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            to="/incomes"
            >Incomes</RouterLink
          >
        </nav>
      </div>
    </header>

    <main class="container py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup></script>
