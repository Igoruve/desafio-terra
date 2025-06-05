import FetchData from "./fetch.js";

const getProjects = async () => {
  const projects = await FetchData("/project");
  return projects;
};

const getProjectById = async (projectId) => {
  const project = await FetchData(`/project/${projectId}`);
  return project;
};

const getProjectsByUserId = async (userId) => {
  const userProjects = await FetchData(`/project/user/${userId}`);
  return userProjects;
};

const getProjectByStatus = async (status) => {
  const projects = await FetchData(`/project/status/${status}`);
  return projects;
};

const getProjectsByDate = async (date) => {
  const projects = await FetchData(`/project/date/${date}`);
  return projects;
};

const createProject = async (data) => {
  const result = await FetchData("/project", "POST", data);
  return result;
};

const deleteProject = async (projectId) => {
  const result = await FetchData(`/project/${projectId}`, "DELETE");
  return result;
};

const editProject = async (projectId, data) => {
  const result = await FetchData(`/project/${projectId}`, "PUT", data);
  return result;
};

export {
  editProject,
  getProjectByStatus,
  getProjectsByDate,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  createProject,
  deleteProject,
};
