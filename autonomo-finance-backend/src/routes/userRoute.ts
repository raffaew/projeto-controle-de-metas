import { Router } from "express";
import { UserController } from "../controllers/userController";
import { GoalController } from "../controllers/goalController";
import { ReleasesController } from "../controllers/releasesController";
import { authMiddleware } from "../middleware/authMiddleware";


const router = Router();

const userController = new UserController();
const goalController = new GoalController();
const releasesController = new ReleasesController();

router.post("/user", userController.addUser);

router.delete("/user/:userId", authMiddleware, userController.deleteUser);

router.get("/users", authMiddleware, userController.getAllUsers);

router.get("/user/metas", authMiddleware, goalController.getUserGoals);

router.post("/meta", authMiddleware, goalController.createGoal);

router.get("/meta/:metaId", authMiddleware, goalController.getGoalById);

router.delete("/meta/:metaId", authMiddleware, goalController.deleteGoal);

router.post("/meta/:metaId/lancamento", authMiddleware, releasesController.addReleaseToGoal);

router.delete("/lancamento/:lancamentoId", authMiddleware, releasesController.deleteRelease);

export default router;
