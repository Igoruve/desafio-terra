import { useLoaderData, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

import { getProjectsByUserId } from "../../utils/project.js";

const ProjectList = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData();

  return (
    <section>
      
    </section>
  );
};

export default ProjectList;
