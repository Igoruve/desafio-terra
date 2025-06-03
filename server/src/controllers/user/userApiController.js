import userController from "./userController.js";
import projectModel from "../models/projectModel.js";  
import {isLoggedInAPI} from "../middleware/authMiddleware.js"; 
import  requirePM from "../middleware/roleMiddleware.js"; 
import requireAdmin from "../middleware/roleMiddleware.js";
import ProjectNotFound from "../utils/errors/ProjectErrors.js";
import {
  UserDoesNotExist,
  ApiKeyRequired,
  UserEmailAlreadyExists,
  RequestingUserNotFound,
  RoleChangeNotAllowed,
  UsersDoNotExist,
} from "../utils/errors/UserErrors.js";



const getUserByName = [
  requirePM,
  requireAdmin,
  async (req, res) => {
  try {
    const user = await getUserByName(req.params.name);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}];

const getAllUsers = [  
  requireAdmin,
  async (req, res) => {
  try {
    const users = await userController.getAll();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof UsersDoNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}];

const getUserById = [  
  requireAdmin,
  async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}];

const createUser = [ 
  requireAdmin,
  async (req, res) => {
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
}];

const editUser = 
  isLoggedInAPI
  async (req, res) => {
  try {
    const user = await userController.editUserById(req.params.userId, req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = [ 
  requireAdmin,
  async (req, res) => {
  try {
    const user = await userController.deleteUserById(req.params.userId);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    if (error instanceof UserDoesNotExist) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}];

const getUserByProjectId = [ 
  requireAdmin,
  
  async (req, res) => {
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
}];

const updateUserRole = [
  isloggedInAPI,
  requireAdmin,
  async (req, res) => {
    try {
      const callerUserId = req.user.userId; // del token
      const { targetUserId } = req.params; //del path por onclick
      const { newRole } = req.body; // del input

      const user = await userController.editUserRole(callerUserId, targetUserId, newRole);
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
  }
];


export {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  getUserByProjectId,
  updateUserRole,
};