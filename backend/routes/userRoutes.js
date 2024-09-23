import express from 'express'
import { deleteUser, getUserId, getUsers, login, registerUser, updateUser } from '../controller/userController.js'
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', login)
router.get('/', getUsers)
router.get('/:id', getUserId)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router