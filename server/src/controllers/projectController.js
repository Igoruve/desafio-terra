import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";
import issueModel from "../models/issueModel.js";

import {
  ProjectTitleNotProvided,
  ProjectDescriptionNotProvided,
  ProjectNotFound,
  ProjectDataMissing,
} from "../utils/errors/projectErrors.js";

import { customAlphabet } from "nanoid";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const validStatuses = ["pending", "in progress", "completed", "cancelled"];

const getProjects = () =>
  projectModel
    .find()
    .populate("clients")
    .populate("manager")
    .populate("issues");

const getProjectById = (id) =>
  projectModel
    .findById(id.trim())
    .populate("clients")
    .populate("manager")
    .populate("issues");

const getProjectsByUserId = async (userId) => {
  const user = await userModel.findById(userId.trim());
  if (!user) throw new Error("UserNotFound");

  return projectModel
    .find({ $or: [{ manager: user._id }, { clients: user._id }] })
    .populate("clients")
    .populate("manager")
    .populate("issues");
};

const getProjectByIssueId = async (issueId) => {
  const issue = await issueModel.findById(issueId.trim());
  if (!issue) throw new Error("IssueNotFound");

  const project = await projectModel
    .findById(issue.project)
    .populate("clients")
    .populate("manager")
    .populate("issues");

  if (!project) throw new ProjectNotFound();

  return project;
};

const getProjectsByDate = (date) =>
  projectModel
    .find({ createdAt: { $gte: date } })
    .populate("clients")
    .populate("manager")
    .populate("issues");

const getProjectByStatus = async (status) => {
  if (!validStatuses.includes(status)) {
    throw new Error("InvalidStatus");
  }

  return projectModel
    .find({ status })
    .populate("clients")
    .populate("manager")
    .populate("issues");
};

const getAllIssues = async (projectId) => {
  const project = await projectModel.findOne({ projectId }).populate("issues");

  if (!project) throw new Errors.ProjectNotFound();
  return project.issues;
};

const createProject = async (data) => {
  if (!data.title || data.title.trim() === "") {
    throw new ProjectTitleNotProvided();
  }

  if (!data.description || data.description.trim() === "") {
    throw new ProjectDescriptionNotProvided();
  }

  let projectId;
  let exists;
  const MAX_ATTEMPTS = 5;
  let attempts = 0;

  do {
    if (attempts >= MAX_ATTEMPTS) {
      throw new Error("ProjectIdGenerationFailed");
    }
    projectId = getRandomCode();
    exists = await projectModel.findOne({ projectId });
    attempts++;
  } while (exists);

  const project = new projectModel({
    ...data,
    projectId,
  });

  return project.save();
};

const updateProject = async (id, updateData) => {
  const project = await projectModel
    .findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
    .populate("clients")
    .populate("manager")
    .populate("issues");

  if (!project) throw new ProjectNotFound();

  return project;
};

const removeProject = async (id) => {
  const project = await projectModel.findByIdAndDelete(id);
  if (!project) throw new ProjectNotFound();

  return project;
};

export {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  getProjectByIssueId,
  getProjectsByDate,
  getProjectByStatus,
  getAllIssues,
  updateProject,
  removeProject,
};
