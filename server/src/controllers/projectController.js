import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";
import issueModel from "../models/issueModel.js";
import { customAlphabet } from "nanoid";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

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

  if (!project) throw new Error("ProjectNotFound");
  return project;
};

const getProjectsByDate = (date) =>
  projectModel
    .find({ createdAt: { $gte: date } })
    .populate("clients")
    .populate("manager")
    .populate("issues");

const getProjectByStatus = (status) =>
  projectModel
    .find({ status: status })
    .populate("clients")
    .populate("manager")
    .populate("issues");

const getAllIssues = async (projectId) => {
  const project = await projectModel
    .findOne({ projectId: projectId })
    .populate("issues");
  return project.issues;
};

const createProject = async (data) => {
  let projectId;
  let exists;

  do {
    projectId = getRandomCode();
    exists = await projectModel.findOne({ projectId });
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

  if (!project) throw new Error("ProjectNotFound");
  return project;
};

const removeProject = async (id) => {
  const project = await projectModel.findByIdAndDelete(id);
  if (!project) throw new Error("ProjectNotFound");
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
