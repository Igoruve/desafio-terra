import { Router } from "express";
import userApiController from "../controllers/user/userApiController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";
import { requireSuperadmin } from "../middlewares/roleMiddleware.js"; 

const router = Router();

router.get("/users", requireSuperadmin, userApiController.getAllUsers);
router.get("/users/:userId", requireSuperadmin, userApiController.getUserById);

router.get("/projects/:projectId/user", requireSPM, userApiController.getUserByProjectId);

router.post("/users", requireSuperadmin, userApiController.createUser);

router.put("/users/:userId", requireSuperadmin, userApiController.updateUser);

router.put("/users/:targetUserId/role", requireSuperadmin, userApiController.updateUserRole);

router.delete("/users/:userId", requireSuperadmin, userApiController.deleteUser);

export default router;
