const express = require('express')
const router = express.Router()

const {
    getInvoicesByCustomerId,
    getAllCustomers,
    createCustomer,
} = require('../controllers/customerController')

// Get invoices for a specific customer
router.get('/:customerId/invoices', getInvoicesByCustomerId)

// Get all customers
router.get('/', getAllCustomers)

// Create a new customer
router.post('/', createCustomer)

module.exports = router
