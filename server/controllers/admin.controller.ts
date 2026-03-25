import { Request, Response } from 'express'
import Order from '../models/order.js'
import Product from '../models/products.js'
import User from '../models/user.js'

// Get dashboard stats
// GET /api/admin/stats
export const getDashboardStats = async (req: Request, res: Response) => {
	try {
		const totalUsers = await User.countDocuments()
		const totalProducts = await Product.countDocuments()
		const totalOrders = await Order.countDocuments()

		const validOrders = await Order.find({ orderStatus: { $ne: 'cancelled' } })
		const totalRevanue = validOrders.reduce(
			(sum, order) => sum + order.totalAmount,
			0,
		)

		const recentOrders = await Order.find()
			.sort('-createdAt')
			.limit(5)
			.populate('user', 'name email')

		res.json({
			success: true,
			data: {
				totalUsers,
				totalProducts,
				totalOrders,
				totalRevanue,
				recentOrders,
			},
		})
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}
