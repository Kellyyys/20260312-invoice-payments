const { get } = require('node:http');
const prisma = require('../utils/prisma');
const { Prisma } = require('@prisma/client');
const { badRequest, notFound, conflict } = require('../utils/errorHandler');

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

async function createCustomer(data) {
    // check if name is provided and is a non-empty string
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        throw badRequest('Customer name is required and must be a non-empty string');
    }

    // check if duplicate name exists
    const existingCustomer = await prisma.customer.findFirst({
        where: { name: { equals: data.name.trim(), mode: 'insensitive' } },
    });
    if (existingCustomer) {
        throw conflict('A customer with this name already exists');
    }

    // Generate the next cutomer ID
    const lastCustomer = await prisma.customer.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
    });

    const nextCustomerId = lastCustomer ? lastCustomer.id + 1 : 1;

    const newCustomer = await prisma.customer.create({
        data: {
            id: nextCustomerId,
            name: data.name.trim(),
        },
    });

    return newCustomer;
}

module.exports = {
    getInvoicesByCustomerId,
    getAllCustomers,
    createCustomer,
};
