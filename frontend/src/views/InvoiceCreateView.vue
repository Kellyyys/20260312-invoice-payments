<template>
  <div class="create-view">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Create Invoice</h1>
        <p class="page-subtitle">Fill in the details to generate your invoice.</p>
      </div>
    </div>

    <!-- Form -->
    <div class="form-body">

      <!-- Customer -->
      <div class="field">
        <label class="field-label">Customer</label>
        <Select
          v-model="form.customer_id"
          :options="customers"
          optionLabel="label"
          optionValue="value"
          placeholder="Select a customer..."
          :loading="loadingCustomers"
          class="w-full"
        />
        <span v-if="errors.customer_id" class="field-error">{{ errors.customer_id }}</span>
      </div>

      <!-- Amount + Currency -->
      <div class="field-row">
        <div class="field flex-1">
          <label class="field-label">Amount</label>
          <InputNumber
            v-model="form.amount"
            placeholder="0.00"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            :min="0.01"
            class="w-full"
          />
          <span v-if="errors.amount" class="field-error">{{ errors.amount }}</span>
        </div>
        <div class="field w-44">
          <label class="field-label">Currency</label>
          <Select
            v-model="form.currency"
            :options="currencyOptions"
            class="w-full"
          />
          <span v-if="errors.currency" class="field-error">{{ errors.currency }}</span>
        </div>
      </div>

      <!-- Issued At -->
      <div class="field">
        <label class="field-label">Issued At</label>
        <DatePicker
          v-model="form.issued_at"
          placeholder="Select date..."
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
        />
        <span v-if="errors.issued_at" class="field-error">{{ errors.issued_at }}</span>
      </div>

      <!-- Due At -->
      <div class="field">
        <label class="field-label">Due At</label>
        <DatePicker
          v-model="form.due_at"
          placeholder="Select date..."
          dateFormat="yy-mm-dd"
          showIcon
          class="w-full"
        />
        <span v-if="errors.due_at" class="field-error">{{ errors.due_at }}</span>
      </div>

      <!-- Status (optional, defaults to PENDING) -->
      <div class="field">
        <label class="field-label">Status <span class="field-optional">(optional — defaults to PENDING)</span></label>
        <Select
          v-model="form.status"
          :options="statusOptions"
          placeholder="PENDING"
          showClear
          class="w-full"
        />
      </div>

      <!-- Submit -->
      <button
        class="submit-btn"
        :disabled="submitting"
        @click="handleSubmit"
      >
        <span v-if="submitting">Creating…</span>
        <span v-else>Create Invoice</span>
      </button>

      <!-- API error -->
      <p v-if="submitError" class="submit-error">{{ submitError }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import { getAllCustomers, createInvoice } from '@/api/invoices'

const router = useRouter()

// ── Options ────────────────────────────────────────────────────────────────
const customers       = ref([])
const loadingCustomers = ref(false)

const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY']
const statusOptions   = ['DRAFT', 'PENDING', 'PAID', 'VOID']

// ── Form state ─────────────────────────────────────────────────────────────
const form = ref({
  customer_id: null,
  amount:      null,
  currency:    'USD',
  issued_at:   null,
  due_at:      null,
  status:      null,
})

const errors      = ref({})
const submitting  = ref(false)
const submitError = ref('')

// ── Load customers for dropdown ────────────────────────────────────────────
const fetchCustomers = async () => {
  loadingCustomers.value = true
  try {
    const data = await getAllCustomers()
    // shape: [{ id, name, ... }] → map to { label, value }
    customers.value = data.map((c) => ({
      label: `${c.name} (ID: ${c.id})`,
      value: c.id,
    }))
  } catch (err) {
    console.error('Failed to load customers:', err)
  } finally {
    loadingCustomers.value = false
  }
}

onMounted(fetchCustomers)

// ── Validation ─────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!form.value.customer_id)   e.customer_id = 'Please select a customer.'
  if (!form.value.amount)        e.amount      = 'Amount must be a positive number.'
  if (!form.value.currency)      e.currency    = 'Please select a currency.'
  if (!form.value.issued_at)     e.issued_at   = 'Please select an issue date.'
  if (!form.value.due_at)        e.due_at      = 'Please select a due date.'
  errors.value = e
  return Object.keys(e).length === 0
}

// ── Submit ─────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return null
  if (typeof d === 'string') return d
  return d.toISOString().slice(0, 10)
}

const handleSubmit = async () => {
  submitError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    await createInvoice({
      customer_id: form.value.customer_id,
      amount:      form.value.amount,
      currency:    form.value.currency,
      issued_at:   formatDate(form.value.issued_at),
      due_at:      formatDate(form.value.due_at),
      status:      form.value.status || 'PENDING',
    })
    router.push('/')
  } catch (err) {
    submitError.value = err?.response?.data?.message ?? 'Failed to create invoice. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@reference "../main.css";

.create-view {
  @apply flex flex-col gap-6 max-w-xl mx-auto;
}

/* Header */
.page-header {
  @apply flex items-start justify-between;
}
.page-title    { @apply text-3xl font-black text-gray-900; }
.page-subtitle { @apply text-sm text-gray-400 mt-1; }
.close-btn {
  @apply text-gray-400 hover:text-gray-700 text-xl font-bold
         w-9 h-9 flex items-center justify-center rounded-full
         hover:bg-gray-100 transition-colors duration-150 cursor-pointer;
}

/* Form */
.form-body { @apply flex flex-col gap-5; }

.field        { @apply flex flex-col gap-1; }
.field-row    { @apply flex items-start gap-4; }
.field-label  { @apply text-sm font-bold text-gray-800; }
.field-optional { @apply text-xs font-normal text-gray-400; }
.field-error  { @apply text-xs text-red-500 mt-0.5; }

/* Submit */
.submit-btn {
  @apply w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm
         hover:bg-gray-700 transition-colors duration-150 cursor-pointer
         disabled:opacity-50 disabled:cursor-not-allowed;
}
.submit-error {
  @apply text-sm text-red-500 text-center -mt-2;
}
</style>