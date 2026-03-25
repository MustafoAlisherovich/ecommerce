import express from 'express'
import {
	addAddress,
	deleteAddress,
	getAdresses,
	updateAddress,
} from '../controllers/address.controller.js'
import { protect } from '../middlewares/auth.js'

const AddressRouter = express.Router()

AddressRouter.get('/', protect, getAdresses)
AddressRouter.post('/', protect, addAddress)
AddressRouter.put('/:id', protect, updateAddress)
AddressRouter.delete('/:id', protect, deleteAddress)

export default AddressRouter
