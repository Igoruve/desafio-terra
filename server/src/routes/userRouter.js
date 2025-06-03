import { Router } from "express";
import userApiController from "../controllers/user/userApiController.js";
import { isLoggedInAPI } from "../middleware/authMiddleware.js";
import { requireSuperadmin } from "../middleware/roleMiddleware.js"; 

const router = Router();

router.get("/users", isLoggedInAPI, requireSuperadmin, userApiController.getAllUsers);
router.get("/users/:userId", isLoggedInAPI, requireSuperadmin, userApiController.getUserById);

router.get("/projects/:projectId/user", isLoggedInAPI, requireSuperadmin, userApiController.getUserByProjectId);

router.post("/users", isLoggedInAPI, requireSuperadmin, userApiController.createUser);

router.put("/users/:userId", isLoggedInAPI, requireSuperadmin, userApiController.updateUser);

router.put("/users/:targetUserId/role", isLoggedInAPI, requireSuperadmin, userApiController.updateUserRole);

router.delete("/users/:userId", isLoggedInAPI, requireSuperadmin, userApiController.deleteUser);

export default router;
