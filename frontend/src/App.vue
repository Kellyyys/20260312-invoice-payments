<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand">📄 Invoice Manager</RouterLink>

      <!-- "+" on list page, "✕" on create page -->
      <RouterLink
        v-if="!isCreatePage"
        to="/invoices/new"
        class="action-btn"
        title="Create new invoice"
      >
        +
      </RouterLink>
      <RouterLink
        v-else
        to="/"
        class="action-btn"
        title="Back to list"
      >
        ✕
      </RouterLink>
    </div>
  </nav>

  <!-- Page Content -->
  <main class="mx-auto max-w-6xl px-6 py-8">
    <RouterView />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCreatePage = computed(() => route.name === 'InvoiceCreate')
</script>

<style scoped>
@reference "./main.css";

.navbar       { @apply w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50; }
.navbar-inner { @apply mx-auto max-w-6xl px-6 py-4 flex items-center justify-between; }
.navbar-brand {
  @apply text-lg font-bold text-gray-800 tracking-tight;
  text-decoration: none;
}

.action-btn {
  @apply w-9 h-9 flex items-center justify-center rounded-full
         text-xl font-bold text-gray-500
         hover:text-gray-900 hover:bg-gray-100
         transition-colors duration-150;
  text-decoration: none;
}
</style>