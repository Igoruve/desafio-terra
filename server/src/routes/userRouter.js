import { Router } from "express";
import userApiController from "../controllers/user/userApiController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";
import requireOwnProfile from "../middlewares/requireOwnProfile.js";
import { requireAdmin, requirePM } from "../middlewares/roleMiddleware.js"; 
import upload from "../middlewares/multer.js";
 


const router = Router();

router.get("/", isLoggedInAPI, requireAdmin, userApiController.getAllUsers);

router.get("/name", isLoggedInAPI, userApiController.getUserByName);

router.get("/projects/:id", isLoggedInAPI, requireAdmin, userApiController.getUserByProjectId);

router.post("/create", isLoggedInAPI, requireAdmin, userApiController.createUser);

router.put("/role", isLoggedInAPI, requireAdmin, userApiController.editUserRole);

router.delete("/:id", isLoggedInAPI, requireAdmin, userApiController.deleteUser);

router.put("/workspace", isLoggedInAPI, requirePM, userApiController.editUserWorkspace);

router.put("/:id", isLoggedInAPI, requireOwnProfile, userApiController.editUser);

router.put("/:id/photo", isLoggedInAPI, requireOwnProfile, upload.single("photo"), userApiController.uploadImage);



/* router.put("/:id", isLoggedInAPI, userApiController.editUser);
 */
router.get("/:id", isLoggedInAPI, requireOwnProfile, userApiController.getUserById);

export default router;