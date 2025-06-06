import {Router} from "express";
import authAPIController from "../controllers/auth/authAPIController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login",authAPIController.login);
router.post("/register",authAPIController.register);
router.post("/logout",authAPIController.logout);
router.get("/me", isLoggedInAPI,authAPIController.getMe);

export default router