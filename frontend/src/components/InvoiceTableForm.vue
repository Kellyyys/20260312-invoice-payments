<template>
  <div class="invoice-card" @click="emit('click')">

    <!-- Left: Customer info -->
    <div class="invoice-col">
      <div class="invoice-field">
        <span class="field-label">Customer ID:</span>
        <span class="field-value">{{ invoice.customer_id }}</span>
      </div>
      <div class="invoice-field">
        <span class="field-label">Customer Name:</span>
        <span class="field-value">{{ invoice.customer.name ?? '—' }}</span>
      </div>
      <div class="invoice-field">
        <span class="field-label">Issue Date:</span>
        <span class="field-value">{{ invoice.issued_at }}</span>
      </div>
    </div>

    <!-- Middle: Invoice info -->
    <div class="invoice-col">
      <div class="invoice-field">
        <span class="field-label">Invoice ID:</span>
        <span class="field-value">{{ invoice.id }}</span>
      </div>
      <div class="invoice-field">
        <span class="field-label">Due Date:</span>
        <span class="field-value">{{ invoice.due_at }}</span>
      </div>
    </div>

    <!-- Right: Amount + Status -->
    <div class="invoice-amount">
      <span class="amount-label">AMOUNT</span>
      <span class="amount-value">{{ currencySymbol(invoice.currency) }}{{ formatAmount(invoice.amount) }}</span>
      <span :class="['status-badge', statusClass(invoice.status)]">
        {{ invoice.status }}
      </span>
    </div>

  </div>
</template>

<script setup>
defineProps({
  invoice: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const formatAmount = (amount) =>
  amount != null ? Number(amount).toLocaleString('en-US') : '0'

const currencySymbol = (currency) => {
  const map = {
    USD: '$',
    CAD: 'CAD$',
    EUR: '€',
    GBP: '£',
    JPY: 'JPY¥',
    CNY: 'CNY¥',
    AUD: 'AUD$',
  }
  return map[currency] || currency || '$'
}

const statusClass = (status) => {
  const map = {
    PAID:    'status-paid',
    PENDING: 'status-pending',
    VOID:    'status-void',
    DRAFT:   'status-draft',
  }
  return map[status]
}
</script>

<style scoped>
@reference "../main.css";
.invoice-card {
  @apply flex items-center justify-between bg-gray-100 rounded-2xl px-6 py-5 gap-4
         hover:bg-gray-200 transition-colors duration-150 cursor-pointer;
}
.invoice-col   { @apply flex flex-col gap-1 flex-1; }
.invoice-field { @apply flex items-center gap-1 text-sm; }
.field-label   { @apply font-bold text-gray-900; }
.field-value   { @apply text-gray-600; }
.invoice-amount { @apply flex flex-col items-end gap-1 min-w-[130px]; }
.amount-label  { @apply text-xs text-gray-400 uppercase tracking-widest; }
.amount-value  { @apply text-2xl font-bold text-gray-900; }
.status-badge  { @apply text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md; }
.status-paid    { @apply bg-green-100 text-green-700; }
.status-pending { @apply bg-blue-100 text-blue-600; }
.status-void    { @apply bg-red-100 text-red-500; }
.status-draft   { @apply bg-yellow-100 text-yellow-600; }
</style>