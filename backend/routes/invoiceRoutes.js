const express = require('express')
const router = express.Router()

const {
    createInvoice,
    getInvoiceById,
    recordPayment,
    getAllInvoices
} = require('../controllers/invoiceController')

// Create a new invoice
router.post('/', createInvoice)

// Get an invoice by ID
router.get('/:id', getInvoiceById)

// Record a payment for an invoice
router.post('/:id/payments', recordPayment)

// Get all invoices
router.get('/', getAllInvoices)

module.exports = router
