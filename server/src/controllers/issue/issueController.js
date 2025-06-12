import issueModel from "../../models/issueModel.js";
import projectModel from "../../models/projectModel.js";
import { sendIssueStatusEmail } from "../../utils/mailer.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

import {
  issueTypeNotProvided,
  deviceNotProvided,
  browserNotProvided,
  clientCommentNotProvided,
  pageUrlNotProvided,
} from "../../utils/errors/issueErrors.js";

import {
  createEasyTask,
  deleteEasyTask,
  editEasyTask,
  uploadImageToTask,
} from "../../utils/clickUpApi/apiFunctions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CAMBIO

async function getIssuesByUser(userId) {
  const issues = await issueModel.find({ client: userId }).populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issues;
}
async function getAllIssues() {
  const issues = await issueModel.find().populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issues;
}
async function getIssueById(issueId) {
  const issue = await issueModel.findOne({ issueId: issueId }).populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issue;
}

async function getIssuesByStatus(status) {
  const issues = await issueModel.find({ status }).populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issues;
}

async function getIssuesByDate(date) {
  const issues = await issueModel.find({ createdAt: { $gte: date } }).populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issues;
}

async function getIssuesByDevice(device) {
  const issues = await issueModel.find({ device: device }).populate({
    path: "client",
    select: "-password -apiKey",
  });
  return issues;
}

async function createIssue(projectId, data, imageFile = null) {
  if (!data.issueType) throw new issueTypeNotProvided();
  if (!data.device) throw new deviceNotProvided();
  if (!data.browser) throw new browserNotProvided();
  if (!data.clientComment) throw new clientCommentNotProvided();
  if (!data.page) throw new pageUrlNotProvided();

  const project = await projectModel
    .findOne({ projectId: projectId })
    .populate({
      path: "manager",
      select: "-password",
    })
    .populate("issues");

  const apiKey = project.manager.apiKey;

  const newEasyTask = await createEasyTask(projectId, apiKey, data);
  data.issueId = newEasyTask.id;

  if (imageFile) {
    console.log("Subiendo imagen a la tarea:", newEasyTask.id);
    console.log("Ruta de la imagen:", imageFile.path);
    console.log("Nombre de la imagen:", imageFile.filename);
    await uploadImageToTask(newEasyTask.id, apiKey, imageFile);
    console.log("Imagen subida");
  }

  const newIssue = await issueModel.create(data);
  newIssue.save();

  project.issues.push(newIssue);
  project.save();

  return newIssue;
}

async function editIssue(issueId, data) {
  //BUscamos la issue antes de actualizar
  const issue = await issueModel
    .findOne({ issueId: issueId })
    .populate("client");
  if (!issue) {
    throw new Error("Issue not found");
  }
  console.log("Issue found:", issue);

  const previousStatus = issue.status;

  //Actualizamos la issue
  const updatedIssue = await issueModel
    .findOneAndUpdate({ issueId }, data, { new: true })
    .populate("client");

  const project = await projectModel
    .findOne({
      $or: [
        { clients: issue.client._id }, // buscar por client ID
        { manager: issue.client._id }, // o buscar por manager ID
      ],
    })
    .populate({
      path: "manager",
      select: "-password", 
    });

  await editEasyTask(issueId, project.manager.apiKey);

  const newStatus = updatedIssue.status;

  //Enviamos el email de actualizacion si corresponde
  const statusEmailMessages = {
    On_Hold: "Issue on hold",
    In_Progress: "Issue in progress",
    Complete: "Issue completed",
    Post_Launch: "Issue post launch",
    Needs_Inputs: "Issue needs inputs",
    Ready_to_upload: "Issue ready to upload",
    Duplicate_Comment: "Issue duplicate comment",
    N_A: "Issue N/A",
  };

  if (
    newStatus &&
    newStatus !== previousStatus &&
    statusEmailMessages[newStatus]
  ) {
    const userEmail = updatedIssue.client?.email;
    const userName = updatedIssue.client?.name || "User";

    if (userEmail) {
      console.log("Enviando email");
      await sendIssueStatusEmail(
        userEmail,
        userName,
        userEmail,
        issue.issueType,
        previousStatus,
        newStatus,
        issue.clientComment,
        issue.createdAt,
        updatedIssue.terraComments,
        new Date(),
        statusEmailMessages[newStatus]
      );
    }
  }

  return updatedIssue;
  /* const issue = await issueModel.findOneAndUpdate({ issueId: issueId }, data, {
    new: true,
  });
  return issue;*/
}

async function replaceIssueScreenshot(issueId, screenshot) {
  const issue = await issueModel.findById(issueId);
  if (!issue) {
    return null;
  }
  if (!screenshot) {
    throw new Error("No screenshot provided");
  }
  if (issue.screenshot) {
    //Borramos la anterior
    const uploadDir = path.join(process.cwd(), "uploads");
    const oldFilePath = path.join(uploadDir, issue.screenshot);

    try {
      await fs.unlink(oldFilePath);
      console.log("Archivo borrado:", oldFilePath); // ✅ Añade esto para ver si llega
    } catch (error) {
      console.warn("Error deleting screenshot file:", error);
    }
  }

  //GUarda la imagen nueva
  issue.screenshot = screenshot.filename;
  await issue.save();
  return issue;
}

async function deleteIssue(issueId) {
  const issue = await issueModel.findOneAndDelete({ issueId: issueId });
  const updatedProject = await projectModel
    .findOneAndUpdate(
      { issues: issue._id },
      { $pull: { issues: issue._id } },
      { new: true }
    )
    .populate({
      path: "manager",
      select: "-password",
    });

  await deleteEasyTask(issue.issueId, updatedProject.manager.apiKey);

  return issue;
}

async function deleteIssueScreenshot(_id) {
  const issue = await issueModel.findById(_id);
  if (!issue) {
    return null;
  }

  if (issue.screenshot) {
    const uploadDir = path.join(process.cwd(), "uploads");
    /* const fileName = path.basename(issue.screenshot); */
    const filePath = path.join(uploadDir, issue.screenshot);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting screenshot file:", error);
    }

    issue.screenshot = null;
    await issue.save();
  }
  return issue;
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
  getIssuesByUser,
  deleteIssueScreenshot,
};
