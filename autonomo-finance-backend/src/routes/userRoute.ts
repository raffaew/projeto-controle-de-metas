import { Router } from 'express'
import { UserController } from '../controllers/userController'

const router = Router()
const userController = new UserController()

router.get('/users', (req, res) => userController.getAllUsers(req, res))

export default router