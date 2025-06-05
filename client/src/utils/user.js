import FetchData from "./fetch.js";

const getUsers = async () => {
  const users = await FetchData("/user");
  return users;
};

const getUserById = async (userId) => {
  const user = await FetchData(`/user/${userId}`);
  return user;
};

const getProjectsByUserId = async (projectId) => {
  const projects = await FetchData(`/user/projects/${projectId}`);
  return projects;
};

const createUser = async (data) => {
  const result = await FetchData("/user", "POST", data);
  return result;
};

const deleteUser = async (userId) => {
  const result = await FetchData(`/user/${userId}`, "DELETE");
  return result;
};

const editUser = async (userId, data) => {
  const result = await FetchData(`/user/${userId}`, "PUT", data);
  return result;
};

const editUserRole = async (userId, data) => {
  const result = await FetchData(`/user/${userId}/role`, "PUT", data);
  return result;
};

export {
  editUser,
  editUserRole,
  getUsers,
  getUserById,
  getProjectsByUserId,
  createUser,
  deleteUser,
};
