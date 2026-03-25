import express from 'express'
import { getDashboardStats } from '../controllers/admin.controller.js'
import { authorize, protect } from '../middlewares/auth.js'

const AdminRouter = express.Router()

// Get dashboard stats
AdminRouter.get('/stats', protect, authorize('admin'), getDashboardStats)

export default AdminRouter
