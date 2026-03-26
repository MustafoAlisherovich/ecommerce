import { getAuth } from '@clerk/express'
import { NextFunction, Request, Response } from 'express'
import User from '../models/user.js'

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { userId } = getAuth(req)

		if (!userId) {
			return res.status(401).json({ success: false, message: 'No auhtorized' })
		}

		let user = await User.findOne({ clerkId: userId })
		req.user = user
		next()
	} catch (error) {
		console.error('Auth Error:', error)
		return res
			.status(500)
			.json({ success: false, message: 'Authentication failed' })
	}
}

export const authorize = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: 'User not found in request',
			})
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: 'User role is not authorized to access this route',
			})
		}

		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: 'User role is not authorized to access this route',
			})
		}

		next()
	}
}
