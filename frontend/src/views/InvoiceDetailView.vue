<template>
  <div class="detail-wrapper">

    <!-- Loading -->
    <template v-if="loading">
      <div class="modal-card">
        <div class="skeleton-line w-40 h-6 mb-6 mx-auto" />
        <div v-for="n in 5" :key="n" class="skeleton-line mb-3" />
      </div>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="modal-card flex flex-col items-center justify-center py-16 gap-3">
        <p class="text-red-400 text-sm">⚠ Failed to load invoice.</p>
        <button class="close-btn" @click="router.push('/')">← Back to list</button>
      </div>
    </template>

    <!-- Invoice Detail -->
    <template v-else-if="invoice">
      <div class="modal-card">

        <!-- Top bar: invoice ID + close + status -->
        <div class="modal-top">
          <button class="close-btn" @click="router.push('/')" title="Back to list">✕</button>
          <h2 class="modal-title">
            <!-- Invoice ID -->
            INV-{{ String(invoice.id) }}
          </h2>
          <span :class="['status-badge', statusClass(invoice.status)]">
            {{ invoice.status }}
          </span>
        </div>

        <!-- Info grid -->
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Customer Name:</span>
            <!-- Customer Name -->
            <span class="info-value">{{ invoice.customer.name ?? '—' }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Customer ID:</span>
            <!-- Customer ID -->
            <span class="info-value">{{ invoice.customer_id }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Amount:</span>
            <!--
              formatInvoice() returns `amount` as a plain Number and adds
              `total_paid` and `remaining_balance`.
            -->
            <span class="info-value">
              {{ invoice.currency ?? '' }} {{ formatAmount(invoice.amount) }}
              <span class="info-sub">
                (paid: {{ formatAmount(invoice.total_paid) }} / remaining: {{ formatAmount(invoice.remaining_balance) }})
              </span>
            </span>
          </div>

          <div class="info-row">
            <span class="info-label">Issue Date:</span>
            <!-- Issue Date-->
            <span class="info-value">{{ invoice.issued_at }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Due Date:</span>
            <!-- Due Date-->
            <span class="info-value">{{ invoice.due_at }}</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Payments history -->
        <div class="section-title">Payments History:</div>

        <div class="payments-table-wrapper">
          <template v-if="!invoice.payments || invoice.payments.length === 0">
            <p class="no-payments">No payments yet.</p>
          </template>
          <template v-else>
            <table class="payments-table">
              <thead>
                <tr>
                  <!-- Payment Fields -->
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in invoice.payments" :key="payment.id">
                  <td>{{ payment.id }}</td>
                  <td>{{ invoice.currency ?? '' }} {{ formatAmount(payment.amount) }}</td>
                  <td>{{ formatDate(payment.paid_at) }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </div>

        <div class="divider" />

        <!-- Add payment — disabled if invoice is PAID or VOID -->
        <div v-if="invoice.status === 'PAID' || invoice.status === 'VOID'" class="paid-notice">
          Payments cannot be added to a {{ invoice.status }} invoice.
        </div>
        <template v-else>
          <PaymentForm
            ref="paymentFormRef"
            :invoice-id="invoice.id"
            :submitting="addingPayment"
            @add-payment="handleAddPayment"
          />
        </template>

      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PaymentForm from '@/components/PaymentForm.vue'


import { getInvoiceById, recordPayment } from '@/api/invoices'

const route  = useRoute()
const router = useRouter()

const invoice       = ref(null)
const loading       = ref(false)
const error         = ref(false)
const addingPayment = ref(false)
const paymentFormRef = ref(null)

// ── Fetch invoice ──────────────────────────────────────────────────────────
const fetchInvoice = async () => {
  loading.value = true
  error.value   = false
  try {
    invoice.value = await getInvoiceById(route.params.id)
  } catch (err) {
    console.error('Failed to fetch invoice:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchInvoice)

// ── Add payment ────────────────────────────────────────────────────────────
const handleAddPayment = async ({ amount, paid_at }) => {
  addingPayment.value = true
  try {
    const newPayment = await recordPayment(route.params.id, { amount, paid_at })
    // Update the invoice by fetching from backend
    invoice.value = await getInvoiceById(route.params.id) 

    // Update status to PAID if fully paid
    // The UI updates immediately without re-fetch.
    if (invoice.value.remaining_balance === 0) {
      invoice.value.status = 'PAID'
    }

    paymentFormRef.value?.reset()
  } catch (err) {
    console.error('Failed to record payment:', err)
    // Pass API error message down to PaymentForm to display inline
    const msg = err?.response?.data?.message ?? 'Failed to add payment. Please try again.'
    paymentFormRef.value?.setApiError(msg)
  } finally {
    addingPayment.value = false
  }
}

// ── Formatters ─────────────────────────────────────────────────────────────
const formatAmount = (val) =>
  val != null ? Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'

const formatDate = (val) => {
  if (!val) return '—'
  // ISO string from backend → slice to YYYY-MM-DD
  return String(val).slice(0, 10)
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
@reference "../views/../main.css";

/* ── Overlay wrapper ── */
.detail-wrapper {
  @apply fixed inset-0 bg-black/30 flex items-center justify-center z-40 p-3;
  top: 65px;
}

/* ── Modal card ── */
.modal-card {
  @apply bg-gray-100 rounded-2xl shadow-xl w-full max-w-2xl p-8 flex flex-col gap-5
         max-h-[85vh] overflow-y-auto;
}

/* ── Top bar ── */
.modal-top {
  @apply flex items-center justify-between gap-3;
}
.modal-title {
  @apply text-lg font-bold text-gray-500 flex-1 text-center tracking-widest uppercase;
}
.close-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-full text-gray-400
         hover:text-gray-800 hover:bg-gray-200 transition-colors duration-150 cursor-pointer
         text-sm font-bold;
}

/* ── Status badge ── */
.status-badge {
  @apply text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md;
}
.status-paid    { @apply bg-green-100 text-green-700; }
.status-pending { @apply bg-blue-100 text-blue-600; }
.status-void    { @apply bg-red-100 text-red-500; }
.status-draft   { @apply bg-yellow-100 text-yellow-600; }
.status-default { @apply bg-gray-200 text-gray-500; }

/* ── Info grid ── */
.info-grid  { @apply flex flex-col gap-2; }
.info-row   { @apply flex items-baseline gap-3 text-sm; }
.info-label { @apply text-gray-500 w-36 shrink-0; }
.info-value { @apply text-gray-900 font-medium; }
.info-sub   { @apply text-xs text-gray-400 ml-1; }

/* ── Divider ── */
.divider { @apply border-t border-gray-200 my-1; }

/* ── Section title ── */
.section-title { @apply text-sm text-gray-500 font-medium; }

/* ── Payments table ── */
.payments-table-wrapper {
  @apply bg-white rounded-xl overflow-auto max-h-48;
}
.no-payments {
  @apply text-sm text-gray-400 italic p-4;
}
.payments-table {
  @apply w-full text-sm border-collapse;
}
.payments-table th {
  @apply text-left text-xs text-gray-400 uppercase tracking-wider px-4 py-3
         border-b border-gray-100 bg-white sticky top-0;
}
.payments-table td {
  @apply px-4 py-3 text-gray-700 border-b border-gray-50;
}
.payments-table tbody tr:last-child td {
  @apply border-0;
}
.payments-table tbody tr:hover td {
  @apply bg-gray-50;
}

/* ── Paid notice ── */
.paid-notice {
  @apply text-sm text-gray-400 italic text-center py-2;
}

/* ── Skeletons ── */
.skeleton-line {
  @apply h-4 bg-gray-200 rounded animate-pulse w-full;
}
</style>