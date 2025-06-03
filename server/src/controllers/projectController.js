import projectModel from "../models/projectModel.js";
import userModel from "../models/userModel.js";
import issueModel from "../models/issueModel.js";

import { customAlphabet } from "nanoid";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const getProjects = () => projectModel.find();

const getProjectById = (id) => projectModel.findById(id.trim());

const getProjectsByUserId = async (userId) => {
  const user = await userModel.findById(userId.trim());
  if (!user) throw new Error("UserNotFound");
  return projectModel.find({ user: user._id });
};

const getProjectByIssueId = async (issueId) => {
  const issue = await issueModel.findById(issueId.trim());
  if (!issue) throw new Error("IssueNotFound");
  const project = await projectModel.findById(issue.project);
  if (!project) throw new Error("ProjectNotFound");
  return project;
};

const getProjectsByDate = (date) =>
  projectModel.find({ createdAt: { $gte: date } });

const createProject = async (data) => {
  const project = new projectModel({
    ...data,
    projectCode: getRandomCode(),
  });
  return project.save();
};

const updateProject = async (id, updateData) => {
  const project = await projectModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
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
  updateProject,
  removeProject,
};
