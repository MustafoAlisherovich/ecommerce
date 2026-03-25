import express from 'express'
import {
	addToCart,
	clearCart,
	getCart,
	removeCartItem,
	updateCartItem,
} from '../controllers/cart.controller.js'
import { protect } from '../middlewares/auth.js'

const CartRouter = express.Router()

// Get user cart
CartRouter.get('/', protect, getCart)

// Add item to cart
CartRouter.post('/add', protect, addToCart)

// Update cart item quantity
CartRouter.put('/item/:productId', protect, updateCartItem)

// Remove item from cart
CartRouter.delete('/item/:productId', protect, removeCartItem)

// Clear cart
CartRouter.delete('/', protect, clearCart)

export default CartRouter
