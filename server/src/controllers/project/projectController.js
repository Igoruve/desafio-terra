import projectModel from "../../models/projectModel.js";
import userModel from "../../models/userModel.js";
import issueModel from "../../models/issueModel.js";
import { createEasyProject, deleteEasyProject } from "../../utils/clickUpApi/apiFunctions.js";

import {
  ProjectTitleNotProvided,
  ProjectDescriptionNotProvided,
  ProjectNotFound,
} from "../../utils/errors/projectErrors.js";

const validStatuses = ["On Hold", "In Progress", "Complete",
  "Post Launch", "Needs Inputs", "Ready to upload",
  "Duplicate Comment", "N/A"];

const getProjects = () =>
  projectModel.find()
    .populate({
      path: "clients",
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
      path: "clients",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");

/* const getProjectsByUserId = async (userId) => {
  const user = await userModel.findById( userId.trim());
  if (!user) throw new Error("UserNotFound");

  return projectModel
    .find({ $or: [{ manager: user._id }, { clients: user._id }] })
    .populate({
      path: "clients",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");
}; */
const getProjectsByUserId = async (userId) => {
  const user = await userModel.findById(userId.trim());
  if (!user) throw new Error("UserNotFound"); //TO DO: cambiar a error personalizado

  return projectModel
    .find({ $or: [{ manager: user._id }, { clients: user._id }] })
    .populate({
      path: "clients",
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
      path: "clients",
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
      path: "clients",
      select: "-password -apiKey"
    })
    .populate({
      path: "manager",
      select: "-password -apiKey"
    })
    .populate("issues");
};

const createProject = async (userId, data) => {
  if (!data.title || data.title.trim() === "") {
    throw new ProjectTitleNotProvided();
  }

  if (!data.description || data.description.trim() === "") {
    throw new ProjectDescriptionNotProvided();
  }

  const user = await userModel.findById({_id: userId});

  console.log( "User: ", user);
  
  if (!user) throw new Error("UserNotFound");

  const newEasyProject = await createEasyProject(user.folderId, user.apiKey, data.title);
  data.projectId = newEasyProject.id;

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
      path: "clients",
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

const editProjectClients = async (id, newClients) => {
  const project = await projectModel
    .findOne({ projectId: id })
    .populate({
      path: "clients",
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
  const addClients = (oldClients, newClients) => {
    newClients.forEach(newClient => {
      const exist = oldClients.some(client => 
        client.equals(newClient)
      );
      if (!exist) {
        oldClients.push(newClient);
      }
    });
  };

  addClients(project.clients, newClients);
  await project.save();

  return project;
};

const deleteProject = async (id) => {
  
  const project = await projectModel.findOne({ projectId: id })
    .populate({
      path: 'manager',
      select: '-password'
    });

  if (!project) throw new ProjectNotFound();

  if (project.issues.length > 0) {
    await issueModel.deleteMany({ _id: { $in: project.issues } });
  }

  await projectModel.deleteOne({ _id: project._id });
  await deleteEasyProject(project.projectId, project.manager.apiKey);

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