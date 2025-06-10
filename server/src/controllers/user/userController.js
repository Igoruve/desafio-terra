import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt";

import {
  UserDoesNotExist,
  ApiKeyRequired,
  UserEmailAlreadyExists,
  RequestingUserNotFound,
  RoleChangeNotAllowed,
  UsersDoNotExist,
  ApiKeyChangeNotAllowed,
  WorkspaceAlreadyAssigned
} from "../../utils/errors/userErrors.js";

import {UserEmailNotProvided, UserPasswordNotProvided, UserNameNotProvided} from "../../utils/errors/authErrors.js";
import { get } from "mongoose";

import { createEasySpaceAndFolder, createEasyFolder, getFolders, getSpaces } from "../../utils/clickUpApi/apiFunctions.js";

// const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

async function getAll() {
  const users = await userModel.find().select("-password -apiKey");
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
  // const user = await userModel.findOneAndDelete({ userId }).select("-password -apiKey");
  const user = await userModel.findByIdAndDelete(userId).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(userId);
  }
  return user;
}

async function editUserById(userId, newData) {
  // const user = await userModel.findOne({ userId }).select("-password -apiKey");
  const user = await userModel.findById(userId).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(userId);
  }

  if (newData.password) {
    newData.password = await bcrypt.hash(newData.password, 10);
  }
  if (newData.role && user.role === "client") {
    throw new RoleChangeNotAllowed();
  }
  if (newData.apiKey && user.role === "client") {
    throw new ApiKeyChangeNotAllowed();
  }
  // const newUser = await userModel.findOneAndUpdate(
  //   { userId },
  //   newData,
  //   { new: true, runValidators: true }
  // ).select("-password -apiKey");
  const newUser = await userModel.findByIdAndUpdate(
    userId,
    newData,
    { new: true, runValidators: true }
  ).select("-password -apiKey");
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

  // const userId = getRandomCode();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await userModel.create({
      // userId,
      name,
      email,
      password: hashedPassword,
      role,
      apiKey,
    });
    // return await userModel.findOne({ userId }).select("-password -apiKey");
    return await userModel.findById(user._id).select("-password -apiKey");
  } catch (error) {
    if (error.code === 11000) {
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

  // const caller = await userModel.findOne({ userId: callerUserId }).select("-password -apiKey");
  const caller = await userModel.findById(callerUserId).select("-password -apiKey");
  if (!caller) {
    throw new RequestingUserNotFound();
  }
  if (caller.role !== "admin") {
    throw new RoleChangeNotAllowed();
  }

  // const user = await userModel.findOneAndUpdate(
  //   { userId: targetUserId },
  //   { role: newRole },
  //   { new: true, runValidators: true }
  // ).select("-password -apiKey");
  const user = await userModel.findByIdAndUpdate(
    targetUserId,
    { role: newRole },
    { new: true, runValidators: true }
  ).select("-password -apiKey");
  if (!user) {
    throw new UserDoesNotExist(targetUserId);
  }
  return user;
}

async function getUserByProjectId(projectId) {
  const project = await projectModel.findOne({ projectId })
    .populate("client").select("-password -apiKey")
    .populate("manager").select("-password -apiKey");

  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  return {
    client: project.client || null,
    manager: project.manager || null
  };
}

async function editUserWorkspace(userId, workspaceId) {

  const user = await userModel.findOne({ _id: userId }).select("-password");

  console.log("User:", user);

  if (!user) {
    throw new UserDoesNotExist(userId);
  }

  if (user.workspaceId === workspaceId) {
    throw new WorkspaceAlreadyAssigned();
  }

  user.workspaceId = workspaceId;
  await user.save();
  
  const userSpaces = await getSpaces(workspaceId, user.apiKey);
  const easySpace = userSpaces.spaces.find(space => space.name === 'EasySpace');

  if (easySpace?.id) {
    user.spaceId = easySpace.id;

    const userFolders = await getFolders(easySpace.id, user.apiKey);
    const easyFolder = userFolders.folders.find(folder => folder.name === 'EasyFolder');

    if (!easyFolder.id) {
      const newFolder = await createEasyFolder(easySpace.id, user.apiKey);
      user.folderId = newFolder.id;
    }

    if (easyFolder.id) {
      user.folderId = easyFolder.id;
    }

  }
  if (!easySpace) {
    const { space, folder } = await createEasySpaceAndFolder(workspaceId, user.apiKey);
    user.spaceId = space.id;
    user.folderId = folder.id;
  }

  await user.save();

  const editedUser = await userModel.findOne({ _id: userId }).select("-password -apiKey");
  if (!editedUser) {
    throw new UserDoesNotExist(userId);
  }

  return editedUser;
}

export default{
  getAll,
  getUserById,
  deleteUserById,
  editUserById,
  createUser,
  editUserRole,
  getUserByName,
  getUserByProjectId,
  editUserWorkspace
};