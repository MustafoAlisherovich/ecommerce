import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import connectDB from './config/db.js'
import { clerkWebhook } from './controllers/webhook.js'
import AddressRouter from './routes/address.route.js'
import CartRouter from './routes/cart.route.js'
import OrderRouter from './routes/order.route.js'
import ProductRouter from './routes/product.route.js'
import makeAdmin from './scripts/make-admin.js'

const app = express()

// Connect to MongoDB
await connectDB()

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook)

// Middleware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
	res.send('Server is Live!')
})

app.use('/api/products', ProductRouter)
app.use('/api/cart', CartRouter)
app.use('/api/orders', OrderRouter)
app.use('/api/addresses', AddressRouter)

await makeAdmin()

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})
