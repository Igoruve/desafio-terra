import { Router } from "express";
import projectAPIController from "../controllers/project/projectAPIController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", isLoggedInAPI, projectAPIController.createProject);

router.get("/", isLoggedInAPI,projectAPIController.getProjects);

router.get("/user/:id", isLoggedInAPI,projectAPIController.getProjectsByUserId);

router.get("/date", isLoggedInAPI,projectAPIController.getProjectsByDate);

router.get("/status", isLoggedInAPI,projectAPIController.getProjectByStatus);

router.put("/:id", isLoggedInAPI,projectAPIController.editProject);

router.put("/:id/clients", isLoggedInAPI,projectAPIController.editProjectClients);

router.delete("/:id", isLoggedInAPI,projectAPIController.deleteProject);

router.get("/:id", isLoggedInAPI,projectAPIController.getProjectById);

export default router;
