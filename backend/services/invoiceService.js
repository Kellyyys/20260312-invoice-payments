const prisma = require('../utils/prisma');
const { Prisma } = require('@prisma/client');

function badRequest(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

async function createInvoice(data) {
    const customer_id = Number(data.customer_id)
    const amount = data.amount
    const currency = data.currency
    const issued_at = data.issued_at
    const due_at = data.due_at
    const status = data.status || 'pending'

    // Validate input fields
    if (!customer_id || Number.isNaN(customer_id)) {
        throw badRequest('customer_id is mandatory and must be a valid integer');
    }

    if (amount == null || Number(amount) <= 0) {
        throw badRequest('amount must be a positive number');
    }

    if (!currency || typeof currency !== 'string') {
        throw badRequest('currency is required');
    }

    if (!issued_at) {
        throw badRequest('issued_at is required');
    }

    if (!due_at) {
        throw badRequest('due_at is required');
    }

    if (!['DRAFT', 'PENDING', 'PAID', 'VOID'].includes(status)) {
        throw badRequest('status must be one of DRAFT, PENDING, PAID, VOID');
    }

    // Check if customer_id exists
    const customer = await prisma.customer.findUnique({
        where: { id: customer_id },
    });
    if (!customer) {
        throw notFound('Customer not found');
    }

    const invoice = await prisma.invoice.create({
        data: {
            customer_id,
            amount: toDecimal(amount),
            currency,
            issued_at: new Date(issued_at),
            due_at: new Date(due_at),
            status,
        },
        include: {
            customer: true,
            payments: true,
        },
    });

    return formatInvoice(invoice);
}

