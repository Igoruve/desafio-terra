import FetchData from "./fetch.js";

const getIssues = async () => {
  const issues = await FetchData("/issue");
  return issues;
};

const getIssueById = async (issueId) => {
  const issue = await FetchData(`/issue/${issueId}`);
  return issue;
};

const getIssuesByStatus = async (status) => {
  const issues = await FetchData(`/issue/status/${status}`);
  return issues;
};

const getIssuesByDate = async (date) => {
  const issues = await FetchData(`/issue/date/${date}`);
  return issues;
};

const getIssuesByDevice = async (device) => {
  const issues = await FetchData(`/issue/device/${device}`);
  return issues;
};

const createIssue = async (projectId, data) => {
  console.log(projectId);

  const result = await FetchData(`/issue/create/${projectId}`, "POST",
    data
  );
  return result;
};

const deleteIssue = async (issueId) => {
  const result = await FetchData(`/issue/${issueId}/delete`, "DELETE");
  return result;
};

const editIssue = async (issueId, data) => {
  const result = await FetchData(`/issue/${issueId}`, "PUT", data);
  return result;
};

export {
  editIssue,
  getIssues,
  getIssueById,
  getIssuesByStatus,
  getIssuesByDate,
  getIssuesByDevice,
  createIssue,
  deleteIssue,
};
