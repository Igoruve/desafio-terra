import issueController from "./issueController.js";
import { sendIssueStatusEmail } from "../../utils/mailer.js";

async function getAllIssues(req, res) {
  try {
    const role = req.user?.role;

    if (role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const issues = await issueController.getAllIssues();
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getIssueById(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await issueController.getIssueById(issueId);
    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getIssuesByStatus(req, res) {
  try {
    const status = req.body.status;
    const issues = await issueController.getIssuesByStatus(status);
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getIssuesByDate(req, res) {
  try {
    const date = req.body.date;
    const issues = await issueController.getIssuesByDate(date);
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getIssuesByDevice(req, res) {
  try {
    const device = req.body.device;
    const issues = await issueController.getIssuesByDevice(device);
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createIssue(req, res) {
  try {
    const role = req.user?.role;

    if (role === "project manager") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const projectId = req.params.projectId;
    console.log(projectId, "hola asier");
    const data = req.body;
    data.client = req.user.userId; //TODO CAMBIAR ESTO PARA QUE PILLE DEL CLIENT
    const issue = await issueController.createIssue(projectId, data);
    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function editIssue(req, res) {
  try {
    const issueId = req.params.id;
    const data = req.body;
    const issue = await issueController.editIssue(issueId, data);
    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteIssue(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await issueController.deleteIssue(issueId);
    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  getAllIssues,
  getIssueById,
  getIssuesByStatus,
  getIssuesByDate,
  getIssuesByDevice,
  createIssue,
  editIssue,
  deleteIssue,
};
