import { Router } from "express";
import issueAPIController from "../controllers/issue/issueApiController.js";
import { isLoggedInAPI } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", isLoggedInAPI, issueAPIController.getAllIssues);

router.get("/status",isLoggedInAPI,issueAPIController.getIssuesByStatus)

router.get("/date", isLoggedInAPI,issueAPIController.getIssuesByDate)

router.get("/device",isLoggedInAPI,issueAPIController.getIssuesByDevice)

router.put("/:id/edit", isLoggedInAPI, issueAPIController.editIssue);

router.get("/:id", issueAPIController.getIssueById);

router.delete("/:id/delete",isLoggedInAPI,issueAPIController.deleteIssue)

router.get("/:id", isLoggedInAPI,issueAPIController.getIssueById)

router.post("/create/:projectId", isLoggedInAPI,issueAPIController.createIssue)

export default router;
