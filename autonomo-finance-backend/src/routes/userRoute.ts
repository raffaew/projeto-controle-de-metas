import { Router } from 'express'
import { UserController } from '../controllers/userController'
import { GoalController } from '../controllers/goalController'
import { ReleasesController } from '../controllers/releasesController'


const router = Router()

const userController = new UserController()
const goalController = new GoalController()
const releasesController = new ReleasesController()

router.post('/user', userController.addUser);

router.get("/users", userController.getAllUsers);

router.post('/meta', goalController.createGoal);

router.get('/meta/:metaId', goalController.getGoalById);

router.get('/user/:userId/metas', goalController.getUserGoals);

router.delete('/meta/:metaId', goalController.deleteGoal);

router.post('/meta/:metaId/lancamento', releasesController.addReleaseToGoal);

router.delete('/lancamento/:lancamentoId', releasesController.deleteRelease);

export default router