import userModel from "../../models/userModel.js";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";

import {
  UserDoesNotExist,
  ApiKeyRequired,
  UserEmailAlreadyExists,
  RequestingUserNotFound,
  RoleChangeNotAllowed,
  UsersDoNotExist,
  ApiKeyChangeNotAllowed
} from "../../utils/errors/userErrors.js";

import {UserEmailNotProvided, UserPasswordNotProvided, UserNameNotProvided} from "../../utils/errors/authErrors.js";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

async function getAll() {
  const users = await userModel.find().select("-password -apiKey"); //para que no devuelva el pwd del user
  if (!users || users.length === 0) {
    throw new UsersDoNotExist();
  }
  return users;
}

async function getUserById(userId) {
  const user = await userModel.findById(userId).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(userId);
  }
  return user;
}


async function getUserByName(name) {
  const user = await userModel.findOne({ name }).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(name);
  }
  return user;
}

async function deleteUserById(userId) {
  const user = await userModel.findOneAndDelete({ userId }).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(userId);
  }
  return user;
}

async function editUserById(userId, newData) {

  const user = await userModel.findOne({ userId }).select("-password -apiKey");

  if (newData.password) {
    newData.password = await bcrypt.hash(newData.password, 10);
  }
  if (newData.role && user.role === "client"){
    throw new RoleChangeNotAllowed()
  }
  if (newData.apiKey && user.role === "client") {
    throw new ApiKeyChangeNotAllowed()
  }
  const newUser = await userModel.findOneAndUpdate(
    { userId },
    newData,
    { new: true, runValidators: true }
  ).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(userId);
  }
  return newUser;
}

async function createUser(userData) {
  const { name, email, password, role, apiKey } = userData;

  if (role === "project manager" && !apiKey) {
    throw new ApiKeyRequired();
  }

    if (!email) throw new UserEmailNotProvided();
    if (!password) throw new UserPasswordNotProvided();
    if (!name) throw new UserNameNotProvided();

  const userId = getRandomCode();

  const hashedPassword = await bcrypt.hash(password, 10); // Hay que hacer hasheo explícito

  try {
    const user = await userModel.create({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
      apiKey,
    });
    return await userModel.findOne({ userId }).select("-password -apiKey");
  } catch (error) {
    if (error.code === 11000) { // Error de duplicado
      throw new UserEmailAlreadyExists();
    }
    throw error;
  }
}

async function editUserRole(callerUserId, targetUserId, newRole) {
  const validRoles = ["project manager", "admin", "client"];
  if (!validRoles.includes(newRole)) {
    throw new Error("Invalid role");
  }

  const caller = await userModel.findOne({ userId: callerUserId }).select("-password -apiKey");
  if (!caller) {
    throw new RequestingUserNotFound();
  }
  if (caller.role !== "admin") {
    throw new RoleChangeNotAllowed();
  }

  try {
    const user = await userModel.findOneAndUpdate(
      { userId: targetUserId },
      { role: newRole },
      { new: true, runValidators: true }
    ).select("-password -apiKey");
    if (!user) {
      throw new UserDoesNotExist(targetUserId);
    }
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new UserEmailAlreadyExists();
    }
    throw error;
  }
}

async function getUserByProjectId(projectId) {
  const project = await projectModel.findOne({ projectId })
    .populate("client").select("-password -apiKey")
    .populate("manager").select("-password -apiKey");

  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  return {
    client: projectModel.client || null,
    manager: projectModel.manager || null
  };
}

export default{
  getAll,
  getUserById,
  deleteUserById,
  editUserById,
  createUser,
  editUserRole,
  getUserByName,
  getUserByProjectId
};