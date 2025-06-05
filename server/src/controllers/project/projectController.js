import projectModel from "../../models/projectModel.js";
import userModel from "../../models/userModel.js";

import {
  ProjectTitleNotProvided,
  ProjectDescriptionNotProvided,
  ProjectNotFound,
} from "../../utils/errors/projectErrors.js";

import { customAlphabet } from "nanoid";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const validStatuses = ["on hold", "in progress", "complete",
  "post launch", "needs inputs", "ready to upload",
  "duplicate comment", "N/A"];

const getProjects = () =>
  projectModel.find()
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

const getProjectById = (id) =>
  projectModel
    .findOne({ projectId: id })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

const getProjectsByUserId = async (userId) => {
  const user = await userModel.findOne({ userId: userId.trim() });
  if (!user) throw new Error("UserNotFound");

  return projectModel
    .find({ $or: [{ manager: user._id }, { client: user._id }] })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");
};
const getProjectsByDate = (date) =>
  projectModel
    .find({ createdAt: { $gte: date } })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

const getProjectsByStatus = async (status) => {
  if (!validStatuses.includes(status)) {
    throw new Error("InvalidStatus");
  }

  return projectModel
    .find({ status })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");
};

const createProject = async (data) => {
  if (!data.title || data.title.trim() === "") {
    throw new ProjectTitleNotProvided();
  }

  if (!data.description || data.description.trim() === "") {
    throw new ProjectDescriptionNotProvided();
  }

  const code = getRandomCode();
  data.projectId = code;

  const project = await projectModel.create(data);

  return project.save();
};

const editProject = async (id, updateData) => {

  const project = await projectModel
    .findOneAndUpdate({ projectId: id }, updateData, {
      new: true,
      runValidators: true,
    })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

  if (!project) throw new ProjectNotFound();

  return project;
};

export const editProjectClients = async (id, newClients) => {
  const project = await projectModel
    .findOne({ projectId: id })
    .populate({
      path: "client",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

  if (!project) {
    const error = new Error("ProjectNotFound");
    error.message = "ProjectNotFound";
    throw error;
  }
  const agregarClientes = (oldClients, newClients) => {
    newClients.forEach(nuevo => {
      const yaExiste = oldClients.some(clienteExistente => 
        clienteExistente.equals(nuevo)
      );
      if (!yaExiste) {
        oldClients.push(nuevo);
      }
    });
  };
  agregarClientes(project.client, newClients);
  await project.save();

  return project;
};

const deleteProject = async (id) => {
  const project = await projectModel.findOneAndDelete({ projectId: id });
  if (!project) throw new ProjectNotFound();

  return project;
};

export default {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  getProjectsByDate,
  getProjectsByStatus,
  editProject,
  editProjectClients,
  deleteProject,
};