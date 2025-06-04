import { Router } from "express";
import userApiController from "../controllers/user/userApiController.js";
import projectApiController from "../controllers/project/projectApiController.js";
import { requireSuperadmin } from "../middleware/roleMiddleware.js"; 

const router = Router();

router.get("/", requireSuperadmin, userApiController.getAllUsers);
router.get("/:userId", requireSuperadmin, userApiController.getUserById);

router.get("/project/:projectId", requireSPM, userApiController.getUserByProjectId);

router.post("/", requireSuperadmin, userApiController.createUser);

router.put("/:userId", requireSuperadmin, userApiController.updateUser);

router.put("/:targetUserId/role", requireSuperadmin, userApiController.updateUserRole);

router.delete("/:userId", requireSuperadmin, userApiController.deleteUser);

export default router;
