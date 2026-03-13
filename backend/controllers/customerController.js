const customerService = require('../services/customerService')

async function getInvoicesByCustomerId(req, res, next) {
    try {
        const invoices = await customerService.getInvoicesByCustomerId(req.params.id);
        return res.status(200).json(invoices);
    } catch (error) {
        return next(error);
    }
}

async function getAllCustomers(req, res, next) {
    try {
        const customers = await customerService.getAllCustomers(req.query);
        return res.status(200).json(customers);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getInvoicesByCustomerId,
    getAllCustomers,
}
