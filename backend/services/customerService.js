const prisma = require('../utils/prisma');
const { Prisma } = require('@prisma/client');

function badRequest(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

async function getInvoicesByCustomerId(id) {
    const customer_id = Number(id)

    if (!customer_id || Number.isNaN(customer_id)) {
        throw badRequest('customer_id is mandatory and must be a valid integer');
    }

    // Check if customer_id exists
    const customer = await prisma.customer.findUnique({
        where: { id: customer_id },
    });
    if (!customer) {
        throw notFound('Customer not found');
    }

    const invoices = await prisma.invoice.findMany({
        where: { customer_id },
        orderBy: { issued_at: 'desc' },
    });

    return invoices;
}

async function getAllCustomers() {
    const customers = await prisma.customer.findMany({
        include: {
            invoices: true,
        },
        orderBy: {
            id: 'desc',
        },
    });

    return customers;
}

module.exports = {
    getInvoicesByCustomerId,
    getAllCustomers,
};
