import userModel from "../../models/userModel.js";
import { UserDoesNotExist } from "../../utils/errors/userErrors.js";

//================= CREATE FUNCTIONS =================
//====================================================
async function createEasySpace(workspaceId, apiKey) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify({
            multiple_assignees: true,
            features: {
                due_dates: {
                    enabled: true,
                    start_date: true,
                    remap_due_dates: true,
                    remap_closed_due_date: true
                },
                time_tracking: { enabled: true },
                tags: { enabled: true },
                time_estimates: { enabled: true },
                checklists: { enabled: true },
                custom_fields: { enabled: true },
                remap_dependencies: { enabled: true },
                dependency_warning: { enabled: true },
                portfolios: { enabled: true }
            },
            name: 'EasySpace',
        })
    };

    const response = await fetch(`https://api.clickup.com/api/v2/team/${workspaceId}/space`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function createEasyFolder(spaceId, apiKey) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify({ name: 'EasyFolder' })
    };

    const response = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}/folder`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function createEasySpaceAndFolder(workspaceId, apiKey) {
    const space = await createEasySpace(workspaceId, apiKey);
    const folder = await createEasyFolder(space.id, apiKey);
    return { space, folder };
}

async function createEasyProject(folderId, apiKey, projectName) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify({ name: projectName })
    };

    const response = await fetch(`https://api.clickup.com/api/v2/folder/${folderId}/list`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function createEasyTask(projectId, apiKey, data) {

    const client = await userModel.findById({ _id: data.client });
    if (!client) {
        throw new Error("Client not found");
    }

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify({
            name: data.issueType,
            description: `Client: ${client.name}\nDevice: ${data.device}\nBrowser: ${data.browser}\nPage: ${data.page}\nComment: ${data.clientComment}`,
        })
    };

    const response = await fetch(`https://api.clickup.com/api/v2/list/${projectId}/task`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}


//================= GET FUNCTIONS ====================
//====================================================
async function getSpaces(workspaceId, apiKey) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/team/${workspaceId}/space`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    console.log(response);

    return response;
}

async function getFolders(spaceId, apiKey) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}/folder`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function getEasySpace(spaceId, apiKey) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/space/${spaceId}`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function getEasyFolder(folderId, apiKey) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/folder/${folderId}`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

//================= DELETE FUNCTIONS ====================
//=======================================================

async function deleteEasyProject(projectId, apiKey) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/list/${projectId}`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function deleteEasyTask(taskId, apiKey) {
    const options = {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            Authorization: apiKey
        }
    };

    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, options)
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            //return res;
        })
        .catch(err => console.error(err));
}

//================= EDIT FUNCTIONS ======================
//=======================================================

async function editEasyProject(projectId, apiKey, data) {
    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify({ name: data.title })
    };

    const response = await fetch(`https://api.clickup.com/api/v2/list/${projectId}`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

async function editEasyTask(taskId, apiKey, data) {
    let editedData = {}

    if (data.title) {
        editedData.name = data.title;
    }

    if (data.description) {
        editedData.description = data.description;
    }

    const options = {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey
        },
        body: JSON.stringify(editedData)
    };

    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;
}

//================= OTHER FUNCTIONS =====================
//=======================================================


/* async function uploadImageToTask(taskId, apiKey){
    const form = new FormData();
    form.append('attachment', fs.createReadStream('./prueba.png'), 'prueba.png');

    const options = {
        method: 'POST',
        headers: {
            Authorization: apiKey,
            ...form.getHeaders()
        },
        body: form
    };

    const response = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, options)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            return res;
        })
        .catch(err => console.error(err));

    return response;

} */

export {
    createEasySpace,
    createEasyFolder,
    createEasySpaceAndFolder,
    createEasyProject,
    createEasyTask,
    getSpaces,
    getFolders,
    getEasySpace,
    getEasyFolder,
    deleteEasyProject,
    deleteEasyTask,
    editEasyProject,
    editEasyTask,
    //uploadImageToTask
};