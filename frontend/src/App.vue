<template>
  <router-link to="/">InvoicesList View</router-link>
  <router-link to="/invoices/1">Invoice Detail View</router-link>
  <router-link to="/invoices/new">Create New Invoice</router-link>
  <main class="mx-auto max-w-6xl px-6 py-8">
    <router-view />
  </main>
</template>
