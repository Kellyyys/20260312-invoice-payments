<template>
  <div class="payment-form">
    <!-- Amount input -->
    <InputNumber
      v-model="paymentAmount"
      placeholder="Amount"
      :minFractionDigits="2"
      :maxFractionDigits="2"
      :min="0.01"
      class="flex-1"
      :class="{ 'p-invalid': errors.amount }"
    />

    <!-- Paid date picker -->
    <DatePicker
      v-model="paidAt"
      placeholder="Paid date"
      dateFormat="yy-mm-dd"
      showIcon
      class="w-40"
      :class="{ 'p-invalid': errors.paidAt }"
    />

    <!-- Confirm button -->
    <button
      class="add-btn"
      :disabled="submitting"
      @click="handleAdd"
    >
      <span v-if="submitting">Adding…</span>
      <span v-else>Add payment</span>
    </button>
  </div>

  <!-- Inline validation errors -->
  <div class="payment-errors">
    <span v-if="errors.amount" class="field-error">{{ errors.amount }}</span>
    <span v-if="errors.paidAt" class="field-error">{{ errors.paidAt }}</span>
    <span v-if="apiError" class="field-error">{{ apiError }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  invoiceId: { type: Number, required: true },
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['add-payment'])

const paymentAmount = ref(null)
const paidAt        = ref(null)
const errors        = ref({})
const apiError      = ref('')

const formatDate = (d) => {
  if (!d) return null
  if (typeof d === 'string') return d
  return d.toISOString().slice(0, 10)
}

const validate = () => {
  const e = {}
  if (!paymentAmount.value || paymentAmount.value <= 0)
    e.amount = 'Amount must be a positive number.'
  if (!paidAt.value)
    e.paidAt = 'Please select a payment date.'
  errors.value = e
  return Object.keys(e).length === 0
}

const handleAdd = () => {
  apiError.value = ''
  if (!validate()) return

  // Emit to parent — parent owns the API call so it can refresh invoice state
  emit('add-payment', {
    amount:  paymentAmount.value,
    paid_at: formatDate(paidAt.value),
  })
}

// Parent can call this to reset the form after a successful add
const reset = () => {
  paymentAmount.value = null
  paidAt.value        = null
  errors.value        = {}
  apiError.value      = ''
}

// Parent can call this to show an API-level error
const setApiError = (msg) => {
  apiError.value = msg
}

defineExpose({ reset, setApiError })
</script>

<style scoped>
@reference "../main.css";

.payment-form {
  @apply flex items-center gap-3 flex-wrap;
}

.add-btn {
  @apply px-5 py-2 rounded-lg bg-green-500 text-white text-sm font-bold
         hover:bg-green-600 transition-colors duration-150 cursor-pointer
         disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap;
}

.payment-errors {
  @apply flex flex-col gap-1 mt-1;
}

.field-error {
  @apply text-xs text-red-500;
}
</style>