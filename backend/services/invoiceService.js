const prisma = require('../utils/prisma');
const { Prisma } = require('@prisma/client');

function badRequest(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

function notFound(message) {
    const err = new Error(message);
    err.statusCode = 404;
    return err;
}

function conflict(message) {
    const err = new Error(message);
    err.statusCode = 409;
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

async function getInvoiceById(id) {
    const invoice_id = Number(id)

    if (!invoice_id ||Number.isNaN(invoice_id)) {
        throw badRequest('Invalid invoice ID');
    }

    const invoice = await prisma.invoice.findUnique({
        where: { id: invoice_id },
        include: {
            customer: true,
        },
    });

    if (!invoice) {
        throw notFound('Invoice not found');
    }

    return formatInvoice(invoice);
}

async function recordPayment(id, data) {
    const invoice_id = Number(id)

    if (!invoice_id || Number.isNaN(invoice_id)) {
        throw badRequest('Invalid invoice ID');
    }

    const invoice = await prisma.invoice.findUnique({
        where: { id: invoice_id },
        include: {
            customer: true,
        },
    });

    // check if invoice exists
    if (!invoice) {
        throw notFound('Invoice not found');
    }
    // check if invoice is already paid or void
    if (invoice.status === 'PAID' || invoice.status === 'VOID') {
        throw conflict('Cannot record payment for a PAID or VOID invoice');
    }

    // payment validation
    const amount = data.amount;
    const paid_at = data.paid_at;

    if(!amount || Number(amount) <= 0) {
        throw badRequest('amount must be a positive number');
    }

    if (!paid_at) {
        throw badRequest('paid_at is required');
    }

    const currentPaid = invoice.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );

    const invoiceAmount = Number(invoice.amount);
    const nextTotalPaid = currentPaid + Number(amount);

    if (nextTotalPaid > invoiceAmount) {
        throw conflict('Payment would exceed invoice amount');
    }

    // payment recording and invoice status update if fully paid
    const payment = await prisma.payment.create({
        data: {
        invoice_id: invoice_id,
        amount: new Prisma.Decimal(amount),
        paid_at: paid_at ? new Date(paid_at) : new Date(),
        },
    });

    if (nextTotalPaid === invoiceAmount) {
        await prisma.invoice.update({
        where: { id: invoice_id },
        data: { status: 'PAID' },
        });
    }

    return {
        ...payment,
        amount: Number(payment.amount),
    };
}

// helper function to format inovice for response
function formatInvoice(invoice) {
    const totalPaid = (invoice.payments || []).reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
    );

    const invoiceAmount = Number(invoice.amount);

    return {
        ...invoice,
        amount: invoiceAmount,
        payments: (invoice.payments || []).map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
        })),
        total_paid: totalPaid,
        remaining_balance: invoiceAmount - totalPaid,
    };
}
