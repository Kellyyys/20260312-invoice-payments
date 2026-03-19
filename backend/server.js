const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req,res) => {
    res.json({ message:'API is running' })
})

app.use('/api/invoices', require('./routes/invoiceRoutes'))
app.use('/api/customers', require('./routes/customerRoutes'))
app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ message: err.message })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})