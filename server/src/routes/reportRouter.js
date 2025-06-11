import {Router} from "express";
import reportAPIController from "../controllers/apiData/reportAPIController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/report", isLoggedInAPI, reportAPIController.generateReport);

export default router