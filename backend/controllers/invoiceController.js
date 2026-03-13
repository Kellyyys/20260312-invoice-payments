const invoiceService = require('../services/invoiceService')

async function createInvoice(req, res, next) {
    try {
        const invoice = await invoiceService.createInvoice(req.body);
        return res.status(201).json(invoice);
    } catch (error) {
        return next(error);
    }
}

async function getInvoiceById(req, res, next) {
    try {
        const invoice = await invoiceService.getInvoiceById(req.params.id);
        return res.status(200).json(invoice);
    } catch (error) {
        return next(error);
    }
}

async function recordPayment(req, res, next) {
    try {
        const payment = await invoiceService.recordPayment(req.params.id, req.body);
        return res.status(200).json(payment);
    } catch (error) {
        return next(error);
    }
}

async function getAllInvoices(req, res, next) {
    try {
        const invoices = await invoiceService.getAllInvoices(req.query);
        return res.status(200).json(invoices);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createInvoice,
    getInvoiceById,
    recordPayment,
    getAllInvoices,
}
