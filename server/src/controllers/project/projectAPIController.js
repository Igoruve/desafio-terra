import projectController from "./projectController.js";

const createProject = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.userId;
  console.log("User ID: ", userId);
    if (role === "client") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = req.body;
    await projectController.createProject(userId, data);
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Error creating project" });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectController.getProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectController.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  }
};

const getProjectsByUserId = async (req, res) => {
  try {
    const projects = await projectController.getProjectsByUserId(req.params.id);
    res.status(200).json(projects);
  } catch (error) {
    if (error.message === "UserNotFound") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getProjectsByDate = async (req, res) => {
  try {
    const projects = await projectController.getProjectsByDate(req.body.date);
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getProjectByStatus = async (req, res) => {
  try {
    const projects = await projectController.getProjectsByStatus(
      req.body.status
    );
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};
const deleteProject = async (req, res) => {
  try {
    await projectController.deleteProject(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    if (error.message === "ProjectNotFound") {
      return res.status(404).json({ message: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

const editProject = async (req, res) => {
  try {
    const project = await projectController.editProject(
      req.params.id,
      req.body
    );
    res.status(200).json(project);
  } catch (error) {
    if (error.message === "ProjectNotFound") {
      return res.status(404).json({ message: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  }
};

const editProjectClients = async (req, res) => {
  try {
    const newClients = req.body.clients;
    const project = await projectController.editProjectClients(
      req.params.id,
      newClients
    );
    res.status(200).json(project);
  } catch (error) {
    if (error.message === "ProjectNotFound") {
      return res.status(404).json({ message: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  }
};

export default{
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  getProjectsByDate,
  getProjectByStatus,
  deleteProject,
  editProject,
  editProjectClients
};
