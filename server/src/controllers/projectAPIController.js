import * as projectController from "./projectController.js";

const createProject = async (req, res) => {
  try {
    const { data } = req.body;
    await projectController.createProject(data);
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
    console.error(error);
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

const getProjectByIssueId = async (req, res) => {
  try {
    const project = await projectController.getProjectByIssueId(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    const statusMap = {
      IssueNotFound: 404,
      ProjectNotFound: 404,
    };
    const messageMap = {
      IssueNotFound: "Issue not found",
      ProjectNotFound: "Project not found",
    };
    res.status(statusMap[error.message] || 500).json({
      message: messageMap[error.message] || "Error fetching project",
    });
  }
};

const getProjectsByDate = async (req, res) => {
  try {
    const projects = await projectController.getProjectsByDate(req.params.date);
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getProjectByStatus = async (req, res) => {
  try {
    const projects = await projectController.getProjectByStatus(
      req.params.status
    );
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await projectController.getAllIssues(req.params.projectId);
    if (!issues) {
      return res
        .status(404)
        .json({ message: "Project not found or no issues" });
    }
    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching issues" });
  }
};

const removeProject = async (req, res) => {
  try {
    await projectController.removeProject(req.params.id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    if (error.message === "ProjectNotFound") {
      return res.status(404).json({ message: "Project not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectController.updateProject(
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

export {
  createProject,
  getProjects,
  getProjectById,
  getProjectsByUserId,
  getProjectByIssueId,
  getProjectsByDate,
  getProjectByStatus,
  getAllIssues,
  removeProject,
  updateProject,
};
