
import userController from "./userController.js";
import projectModel from "../../models/projectModel.js";  
import {ProjectNotFound} from "../../utils/errors/projectErrors.js";
import {
  UserDoesNotExist,
  ApiKeyRequired,
  UserEmailAlreadyExists,
  RequestingUserNotFound,
  RoleChangeNotAllowed,
  UsersDoNotExist,
} from "../../utils/errors/userErrors.js";



const getUserByName = async (req, res) => {
  try {
    const user = await userController.getUserByName(req.body.name);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userController.getAll();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof UsersDoNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof UserEmailAlreadyExists ||
      error instanceof ApiKeyRequired
    ) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUser = async (req, res) => {
  try {
    const user = await userController.editUserById(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userController.deleteUserById(req.params.id);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByProjectId = async (req, res) => {
  try {
    const project = await projectModel.findById(req.params.projectId);
    if (!project) {
      throw new ProjectNotFound();
    }
    if (!project.userId) {
      return res.status(404).json({ error: "No user associated with this project" });
    }
    const user = await userController.getUserById(project.userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof ProjectNotFound || error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserRole = async (req, res) => {
  try {
    const adminUserId = req.user.userId;
    const { userId, newRole } = req.body;

    const user = await userController.editUserRole(adminUserId, userId, newRole);
    res.status(200).json(user);
  } catch (error) {
    if (
      error instanceof UserDoesNotExist ||
      error instanceof RequestingUserNotFound ||
      error instanceof RoleChangeNotAllowed
    ) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserWorkspace = async (req, res) => {
  try {
    //const userId = req.user.userId; //TODO descomentar para usar cookies
    const userId = req.params.id;
    const workspaceId = req.body.workspaceId;
    const user = await userController.editUserWorkspace(userId, workspaceId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};


export default{
  getAllUsers,
  getUserById,
  getUserByName,
  createUser,
  editUser,
  deleteUser,
  getUserByProjectId,
  editUserRole,
  editUserWorkspace
};