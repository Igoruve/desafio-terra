import issueController from "./issueController.js";
import { sendIssueStatusEmail } from "../../utils/mailer.js";
import fs from "fs/promises";

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
    
    //Si hay archivo, añaddir ruta al data para guardar en BD
    if(req.file){
      //Guarda la ruta donde subio la imagen
      data.screenshot = req.file.filename; 
    }

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
    console.log("EDIT ISSUE ---");
    console.log("ID:", issueId);
    console.log("BODY:", data);
    const issue = await issueController.editIssue(issueId, data);
    console.log("UPDATED ISSUE:", issue);
    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error mandando el mail" });
  }
}

async function replaceIssueScreenshot(req, res) {
  try {
    const issueId = req.params.id;

    if(!req.file){
      return res.status(400).json({ error: "No file uploaded" });
    }

    const issue = await issueController.replaceIssueScreenshot(issueId, req.file);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({message: "Screenshot updated successfully"});
  } catch (error) {
    console.error("Error replacing screenshot:", error);
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

async function deleteIssueScreenshot(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await issueController.deleteIssueScreenshot(issueId);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    /* if (issue.screenshot) {
      const filePath = path.join(process.cwd(), issue.screenshot);
      await fs.unlink(filePath);
    }
    issue.screenshot = null;
    await issue.save(); */

    res.json({ message: "Screenshot deleted successfully" });
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
  replaceIssueScreenshot,
  deleteIssue,
  deleteIssueScreenshot
};
