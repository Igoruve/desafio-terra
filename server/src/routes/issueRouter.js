import {Router} from "express";
import issueAPIController from "../controllers/issue/issueApiController.js"
import { isLoggedInAPI} from "../middlewares/authMiddleware.js";
import {isClient} from "../middlewares/clientMiddleware.js";

const router = Router();

router.get("/",isLoggedInAPI,issueAPIController.getAllIssues)

router.get("/:id", issueAPIController.getIssueById)

router.get("/status",issueAPIController.getIssuesByStatus)

router.get("/date",issueAPIController.getIssuesByDate)

router.get("/device",issueAPIController.getIssuesByDevice)

router.post("/create/:projectId",isLoggedInAPI,issueAPIController.createIssue)

router.put("/:id/edit",isLoggedInAPI,issueAPIController.editIssue)

router.delete("/:id/delete",issueAPIController.deleteIssue)

export default router;