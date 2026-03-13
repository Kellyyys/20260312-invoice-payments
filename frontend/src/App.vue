<template>
  <!-- Navbar -->
  <nav class="navbar">
    <div class="navbar-inner">
      <span class="navbar-brand">📄 Invoice Manager</span>
      <div class="navbar-links">
        <RouterLink to="/invoices/new" class="nav-link" active-class="nav-link-active">
          +
        </RouterLink>
      </div>
    </div>
  </nav>

  <!-- Page Content -->
  <main class="mx-auto max-w-6xl px-6 py-8">
    <RouterView />
  </main>
</template>

<style scoped>
@reference "./main.css";
.navbar {
  @apply w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50;
}

.navbar-inner {
  @apply mx-auto max-w-6xl px-6 py-4 flex items-center justify-between;
}

.navbar-brand {
  @apply text-lg font-bold text-gray-800 tracking-tight;
}

.navbar-links {
  @apply flex items-center gap-4;
}

.nav-link {
  @apply text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-gray-100;
}

.nav-link-active {
  @apply text-gray-900 bg-gray-100;
}
</style>