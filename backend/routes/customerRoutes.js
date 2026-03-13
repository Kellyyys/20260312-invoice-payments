const express = require('express')
const router = express.Router()

const {
    getInvoicesByCustomerId,
    getAllCustomers,
} = require('../controllers/customerController')

// Get invoices for a specific customer
router.get('/:customerId/invoices', getInvoicesByCustomerId)

// Get all customers
router.get('/', getAllCustomers)

module.exports = router
