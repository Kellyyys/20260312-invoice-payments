import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

export async function getAllInvoices(params = {}) {
  const response = await api.get('/invoices', { params })
  return response.data
}

export async function getInvoiceById(id) {
  const response = await api.get(`/invoices/${id}`)
  return response.data
}

export async function createInvoice(body) {
  const response = await api.post('/invoices', body)
  return response.data
}

export async function recordPayment(invoiceId, body) {
  const response = await api.post(`/invoices/${invoiceId}/payments`, body)
  return response.data
}

export async function getInvoicesByCustomerId(customerId) {
  const response = await api.get(`/customers/${customerId}/invoices`)
  return response.data
}

export async function getAllCustomers() {
  const response = await api.get('/customers')
  return response.data
}
