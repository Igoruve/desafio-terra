import { Router } from "express";
import projectAPIController from "../controllers/projectAPIController.js";

const router = Router();

router.post("/", projectAPIController.createProject);

router.get("/", projectAPIController.getProjects);

router.get("/user/:id", projectAPIController.getProjectsByUserId);

router.get("/issue/:id", projectAPIController.getProjectsByIssueId);

router.get("/date/:date", projectAPIController.getProjectsByDate);

router.get("/status/:status", projectAPIController.getProjectsByStatus);

router.get("/issues/:projectId", projectAPIController.getAllIssuesByProject);

router.put("/:id", projectAPIController.updateProject);

router.delete("/:id", projectAPIController.removeProject);

router.get("/:id", projectAPIController.getProjectbyId);

export default router;
