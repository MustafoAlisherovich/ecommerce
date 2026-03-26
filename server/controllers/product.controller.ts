import { Request, Response } from 'express'
import imagekit from '../config/imagekit.js'
import Product from '../models/products.js'

// Get all products
// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10 } = req.query
		const query: any = { isActive: true }

		const total = await Product.countDocuments(query)
		const products = await Product.find(query)
			.skip((Number(page) - 1) * Number(limit))
			.limit(Number(limit))

		res.json({
			success: true,
			data: products,
			pagination: {
				total,
				page: Number(page),
				pages: Math.ceil(total / Number(limit)),
			},
		})
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// Get single product
// GET /api/product/:id
export const getProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' })
		}

		res.json({ success: true, data: product })
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// Crteate Product
// POST /api/prodcuts
export const createProduct = async (req: Request, res: Response) => {
	try {
		let images: { url: string; fileId: string }[] = []

		// Handle file uploads
		if (req.files && Array.isArray(req.files) && req.files.length > 0) {
			const uploadPromises = req.files.map((file: Express.Multer.File) =>
				imagekit.upload({
					file: file.buffer,
					fileName: `${Date.now()}-${file.originalname}`
						.replace(/\s+/g, '-')
						.replace(/[^\w.-]/g, ''),
					folder: '/ecom-app/products',
				}),
			)

			const uploadedImages = await Promise.all(uploadPromises)
			images = uploadedImages.map(img => ({
				url: img.url,
				fileId: img.fileId,
			}))
		}

		let sizes = req.body.sizes || []

		if (typeof sizes === 'string') {
			try {
				sizes = JSON.parse(sizes)
			} catch (error) {
				sizes = sizes
					.split(',')
					.map((s: string) => s.trim())
					.filter((s: string) => s !== '')
			}
		}

		// Ensure array
		if (!Array.isArray(sizes)) sizes = [sizes]

		const productData = {
			...req.body,
			images,
			sizes,
		}

		if (images.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'Please upload at least one image',
			})
		}

		const product = await Product.create(productData)

		return res.status(201).json({
			success: true,
			data: product,
		})
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// Update product
// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
	try {
		let images: { url: string; fileId: string }[] = []

		if (req.body.existingImages) {
			if (Array.isArray(req.body.existingImages)) {
				images = [...req.body.existingImages]
			} else {
				images = [req.body.existingImages]
			}
		}

		// Handle file uploads
		if (req.files && Array.isArray(req.files) && req.files.length > 0) {
			const uploadPromises = req.files.map((file: Express.Multer.File) =>
				imagekit.upload({
					file: file.buffer,
					fileName: `${Date.now()}-${file.originalname}`
						.replace(/\s+/g, '-')
						.replace(/[^\w.-]/g, ''),
					folder: '/ecom-app/products',
				}),
			)

			const uploadedImages = await Promise.all(uploadPromises)
			images = uploadedImages.map(img => ({
				url: img.url,
				fileId: img.fileId,
			}))
		}

		const updates = { ...req.body }

		if (req.body.size) {
			let sizes = req.body.sizes

			if (typeof sizes === 'string') {
				try {
					sizes = JSON.parse(sizes)
				} catch (error) {
					sizes = sizes
						.split(',')
						.map((s: string) => s.trim())
						.filter((s: string) => {
							s !== ''
						})
				}
			}
			if (!Array.isArray(sizes)) sizes = [sizes]
			updates.sizes = sizes
		}

		if (
			req.body.existingImages ||
			(req.files && (req.files as any).length > 0)
		) {
			updates.images = images
		}

		delete updates.existingImages

		const product = await Product.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		})

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' })
		}

		res.json({ success: true, data: product })
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}

// Delete product
// DELETE /api/product/:id
export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const product = await Product.findById(req.params.id)

		if (!product) {
			return res
				.status(400)
				.json({ success: false, message: 'Product not found' })
		}

		// Delete images from Cloudinary
		if (product.images && product.images.length > 0) {
			await Promise.all(
				product.images.map(async (image: any) => {
					if (image.fileId) {
						await imagekit.deleteFile(image.fileId)
					}
				}),
			)
		}

		await Product.findByIdAndDelete(req.params.id)
		res.json({ success: true, message: 'Product deleted' })
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message })
	}
}
