import { useLoaderData, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

import { createProject, deleteProject } from "../../utils/project.js";

const ProjectList = () => {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const [search, setSearch] = useState("");


    return (
        <h1>hola</h1>
    )

}

export default ProjectList;