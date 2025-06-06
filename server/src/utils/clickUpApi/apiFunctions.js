
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
        .then(res => console.log(res))
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
        .then(res => console.log(res))
        .catch(err => console.error(err));

    return response;
}

async function createEasySpaceAndFolder(workspaceId, apiKey) {
    const space = await createEasySpace(workspaceId, apiKey);
    const folder = await createEasyFolder(space.id, apiKey);
    return { space, folder };
}

export {
    createEasySpace,
    createEasyFolder,
    createEasySpaceAndFolder
};