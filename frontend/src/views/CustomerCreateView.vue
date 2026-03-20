<template>
  <div class="create-view">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Hello, New Customer!</h1>
        <p class="page-subtitle">Fill in the details to begin your journey with us.</p>
      </div>
    </div>

    <!-- Form -->
    <div class="form-body">

      <!-- Customer -->
      <div class="field">
        <label class="field-label">Your Name:</label>
        <div class="search-box">
            <input
                v-model="customerName"
                type="text"
                placeholder="Enter your name..."
                class="type-input"
            />
        </div>
      </div>

      <!-- Submit -->
      <button
        class="submit-btn"
        :disabled="submitting"
        @click="handleSubmit"
      >
        <span v-if="submitting">Creating…</span>
        <span v-else>Create User</span>
      </button>

      <!-- API error -->
      <p v-if="submitError" class="submit-error">{{ submitError }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { createCustomer } from '@/api/invoices'

const router = useRouter()

// ── Options ────────────────────────────────────────────────────────────────
const customerName       = ref("")

// ── Form state ─────────────────────────────────────────────────────────────
const errors      = ref({})
const submitting  = ref(false)
const submitError = ref('')

// ── Validation ─────────────────────────────────────────────────────────────
const validate = () => {
  const e = {}
  if (!customerName.value)       e.customer_name = 'Please enter a customer name.'
  errors.value = e
  return Object.keys(e).length === 0
}

// ── Submit ─────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  submitError.value = ''
  if (!validate()) return

  submitting.value = true
  try {
    await createCustomer({name: customerName.value.trim()})
    clearCustomerName()
    router.push('/')
  } catch (err) {
    submitError.value =  err.response?.data?.message || 'An error occurred while creating the customer.'
  } finally {
    submitting.value = false
  }
}

// ── Clear helpers ──────────────────────────────────────────────────────────
const clearCustomerName = () => {
  customerName.value       = ''
}

</script>

<style scoped>
@reference "../main.css";

.create-view {
  @apply flex flex-col gap-6 max-w-xl mx-auto justify-center;
  min-height: calc(100vh - 170px)
}

/* Header */
.page-header {
  @apply flex items-start justify-between;
}
.page-title    { @apply text-3xl font-black text-gray-900; }
.page-subtitle { @apply text-sm text-gray-400 mt-1; }

/* Form */
.form-body { @apply flex flex-col gap-5; }
.search-wrapper { @apply flex justify-center; }
.search-box {
  @apply flex items-center w-full max-w-xl
         bg-gray-200 rounded-full overflow-hidden px-4 gap-2;
}
.type-input {
  @apply flex-1 bg-transparent border-0 outline-none py-3
         text-gray-700 placeholder-gray-400 text-sm;
}

.field        { @apply flex flex-col gap-1; }
.field-label  { @apply text-sm font-bold text-gray-800; }

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