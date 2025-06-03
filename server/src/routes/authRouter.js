import {Router} from "express";
import authAPIController from "../controllers/auth/authAPIController.js";

const router = Router();

router.post("/login",authAPIController.login);
router.post("/register",authAPIController.register);

export default router