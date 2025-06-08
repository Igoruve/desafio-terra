import issueModel from "../../models/issueModel.js";
import projectModel from "../../models/projectModel.js";

import {
    issueTypeNotProvided,
    deviceNotProvided, browserNotProvided,
    clientCommentNotProvided, pageUrlNotProvided
} from "../../utils/errors/issueErrors.js";

import { createEasyTask } from "../../utils/clickUpApi/apiFunctions.js";

async function getAllIssues() {
    const issues = await issueModel.find().populate({
        path: "client",
        select: "-password -apiKey"
    });
    return issues;
}
async function getIssueById(issueId) {
    const issue = await issueModel.findOne({ issueId: issueId }).populate({
        path: "client",
        select: "-password -apiKey"
    });
    return issue;
}

async function getIssuesByStatus(status) {
    const issues = await issueModel.find({ status }).populate({
        path: "client",
        select: "-password -apiKey"
    });
    return issues;
}


async function getIssuesByDate(date) {
    const issues = await issueModel.find({ createdAt: { $gte: date } }).populate({
        path: "client",
        select: "-password -apiKey"
    });
    return issues;
}

async function getIssuesByDevice(device) {
    const issues = await issueModel.find({ device: device }).populate({
        path: "client",
        select: "-password -apiKey"
    });
    return issues;
}
async function createIssue(projectId, data) {

    if (!data.issueType) throw new issueTypeNotProvided();
    if (!data.device) throw new deviceNotProvided();
    if (!data.browser) throw new browserNotProvided();
    if (!data.clientComment) throw new clientCommentNotProvided();
    if (!data.page) throw new pageUrlNotProvided();

    const project = await projectModel.findOne({ projectId: projectId })
        .populate({
            path: "manager",
            select: "-password"
        })
        .populate("issues");
    const apiKey = project.manager.apiKey;
    const newEasyTask = await createEasyTask(projectId, apiKey, data);
    data.issueId = newEasyTask.id;

    const newIssue = await issueModel.create(data);
    newIssue.save();

    project.issues.push(newIssue);
    project.save();

    return newIssue;
}

async function editIssue(issueId, data) {
    const issue = await issueModel.findOneAndUpdate({ issueId: issueId }, data, { new: true });
    return issue;
}

async function deleteIssue(issueId) {
    const issue = await issueModel.findOneAndDelete({ issueId: issueId });
    return issue;
}

export default {
    getAllIssues,
    getIssueById,
    getIssuesByStatus,
    getIssuesByDate,
    getIssuesByDevice,
    createIssue,
    editIssue,
    deleteIssue
}