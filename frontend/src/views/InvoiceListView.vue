<template>
  <div class="list-view">

    <!-- Search Bar -->
    <div class="search-wrapper">
      <div class="search-box">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search by Customer ID..."
          class="search-input"
          @keyup.enter="applySearch"
        />
        <button class="search-btn" @click="applySearch" title="Search">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">

      <!-- Date Range + Confirm -->
      <div class="date-group">
        <label class="date-label">Issued Date:</label>
        <div class="date-inputs">
          <DatePicker
            v-model="dateFrom"
            placeholder="From"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-40"
          />
          <span class="date-sep">—</span>
          <DatePicker
            v-model="dateTo"
            placeholder="To"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-40"
          />
          <button class="confirm-btn" @click="applyDateFilter">
            Confirm
          </button>
        </div>
      </div>

      <!-- Status Dropdown -->
      <Select
        v-model="selectedStatus"
        :options="statusOptions"
        placeholder="Status"
        showClear
        class="w-44"
        @change="applyStatusFilter"
        @clear="applyStatusFilter"
      />
    </div>

    <!-- Active filters summary -->
    <div v-if="hasActiveFilters" class="active-filters">
      <span class="filter-label">Filters:</span>
      <span v-if="appliedCustomerId" class="filter-tag">
        Customer ID: {{ appliedCustomerId }}
        <button @click="clearCustomerId">✕</button>
      </span>
      <span v-if="appliedFrom || appliedTo" class="filter-tag">
        Date: {{ appliedFrom ?? '…' }} → {{ appliedTo ?? '…' }}
        <button @click="clearDateRange">✕</button>
      </span>
      <span v-if="appliedStatus" class="filter-tag">
        Status: {{ appliedStatus }}
        <button @click="clearStatus">✕</button>
      </span>
      <button class="clear-all-btn" @click="clearAll">Clear all</button>
    </div>

    <!-- Invoice Cards -->
    <div class="invoice-list">

      <template v-if="loading">
        <div v-for="n in 3" :key="n" class="skeleton-card" />
      </template>

      <template v-else-if="error">
        <div class="state-msg">
          <p class="text-red-400 text-sm">⚠ Failed to load invoices. Make sure your backend is running on port 5000.</p>
        </div>
      </template>

      <template v-else-if="invoices.length === 0">
        <div class="state-msg">
          <p class="text-gray-400 text-sm">No invoices found.</p>
        </div>
      </template>

      <template v-else>
        <InvoiceTableForm
          v-for="invoice in invoices"
          :key="invoice.id"
          :invoice="invoice"
        />
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import InvoiceTableForm from '@/components/InvoiceTableForm.vue'
import { getAllInvoices } from '@/api/invoices'

// ── UI state (what the user is currently typing / picking) ─────────────────
const searchInput    = ref('')
const dateFrom       = ref(null)
const dateTo         = ref(null)
const selectedStatus = ref(null)

// ── Applied state (what has actually been sent to the backend) ─────────────
const appliedCustomerId = ref('')
const appliedFrom       = ref(null)
const appliedTo         = ref(null)
const appliedStatus     = ref(null)

// ── Data ───────────────────────────────────────────────────────────────────
const invoices = ref([])
const loading  = ref(false)
const error    = ref(false)

const statusOptions = ['PENDING', 'PAID', 'VOID', 'DRAFT']

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return null
  if (typeof d === 'string') return d
  // DatePicker returns a Date object
  return d.toISOString().slice(0, 10)
}

const hasActiveFilters = computed(() =>
  !!appliedCustomerId.value || !!appliedFrom.value || !!appliedTo.value || !!appliedStatus.value
)

// ── Fetch ──────────────────────────────────────────────────────────────────
const fetchInvoices = async () => {
  loading.value = true
  error.value   = false
  try {
    const params = {}
    if (appliedCustomerId.value) params.customer_id = appliedCustomerId.value
    if (appliedFrom.value)       params.from        = appliedFrom.value
    if (appliedTo.value)         params.to          = appliedTo.value
    if (appliedStatus.value)     params.status      = appliedStatus.value

    invoices.value = await getAllInvoices(params)
  } catch (err) {
    console.error('Failed to fetch invoices:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchInvoices)

// ── Trigger actions ────────────────────────────────────────────────────────
const applySearch = () => {
  appliedCustomerId.value = searchInput.value.trim()
  fetchInvoices()
}

const applyDateFilter = () => {
  appliedFrom.value = formatDate(dateFrom.value)
  appliedTo.value   = formatDate(dateTo.value)
  fetchInvoices()
}

const applyStatusFilter = () => {
  appliedStatus.value = selectedStatus.value ?? null
  fetchInvoices()
}

// ── Clear helpers ──────────────────────────────────────────────────────────
const clearCustomerId = () => {
  searchInput.value       = ''
  appliedCustomerId.value = ''
  fetchInvoices()
}

const clearDateRange = () => {
  dateFrom.value    = null
  dateTo.value      = null
  appliedFrom.value = null
  appliedTo.value   = null
  fetchInvoices()
}

const clearStatus = () => {
  selectedStatus.value = null
  appliedStatus.value  = null
  fetchInvoices()
}

const clearAll = () => {
  searchInput.value       = ''
  dateFrom.value          = null
  dateTo.value            = null
  selectedStatus.value    = null
  appliedCustomerId.value = ''
  appliedFrom.value       = null
  appliedTo.value         = null
  appliedStatus.value     = null
  fetchInvoices()
}
</script>

<style scoped>
@reference "../main.css";

.list-view { @apply flex flex-col gap-5; }

/* ── Search ── */
.search-wrapper { @apply flex justify-center; }
.search-box {
  @apply flex items-center w-full max-w-xl
         bg-gray-200 rounded-full overflow-hidden px-4 gap-2;
}
.search-input {
  @apply flex-1 bg-transparent border-0 outline-none py-3
         text-gray-700 placeholder-gray-400 text-sm;
}
.search-btn {
  @apply flex items-center justify-center shrink-0
         text-gray-400 hover:text-gray-700 transition-colors duration-150;
}
.search-icon { @apply h-4 w-4; }

/* ── Filters ── */
.filters-row { @apply flex items-end justify-between gap-4 flex-wrap; }
.date-group  { @apply flex flex-col gap-1; }
.date-label  { @apply text-sm font-semibold text-gray-700; }
.date-inputs { @apply flex items-center gap-2; }
.date-sep    { @apply text-gray-400 font-bold; }
.confirm-btn {
  @apply px-4 py-2 text-sm font-semibold rounded-lg
         bg-gray-800 text-white hover:bg-gray-600
         transition-colors duration-150 cursor-pointer;
}

/* ── Active filter tags ── */
.active-filters {
  @apply flex items-center gap-2 flex-wrap text-sm;
}
.filter-label { @apply text-gray-500 font-medium; }
.filter-tag {
  @apply flex items-center gap-1 bg-gray-200 text-gray-700
         px-3 py-1 rounded-full text-xs font-medium;
}
.filter-tag button {
  @apply text-gray-400 hover:text-gray-700 ml-1 cursor-pointer;
}
.clear-all-btn {
  @apply text-xs text-red-400 hover:text-red-600 underline cursor-pointer ml-1;
}

/* ── Invoice list ── */
.invoice-list {
  @apply flex flex-col gap-4 overflow-y-auto pr-1;
  max-height: calc(100vh - 300px);
}
.skeleton-card { @apply h-24 bg-gray-100 rounded-2xl animate-pulse; }
.state-msg     { @apply flex justify-center items-center py-20; }
</style>