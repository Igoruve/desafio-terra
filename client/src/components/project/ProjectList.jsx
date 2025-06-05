import { useLoaderData, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

import { getProjectsByUserId } from "../../utils/project.js";

import Project from "./Project.jsx";

const ProjectList = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();
  const [projects, setProjects] = useState(loaderData);

  return (
    <section>
      <h2 className="text-white/80 text-xl py-8">Projects</h2>
    </section>
  );
};

export default ProjectList;
