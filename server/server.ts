import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import connectDB from './config/db.js'
import { clerkWebhook } from './controllers/webhook.js'

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

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})
