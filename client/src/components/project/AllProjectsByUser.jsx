import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const AllProjectsByUser = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {

      if (!userData || !userData.userId || !userData.role) {
        setError("Please log in to view projects.");
        setLoading(false);
        return;
      }

      let endpoint = "";

      if (userData.role === "admin") {
        endpoint = "/project/"; 
      } else if (userData.role === "client" || userData.role === "pm") {
        endpoint = `/project/user/${userData.userId}`;  
      } else {
        setError("You do not have permission to view projects.");
        setLoading(false);
        return;
      }

      const result = await FetchData(endpoint);

      if (result.error) {
        setError(result.message || "Something went wrong");
      } else {
        setError(null);
        setProjects(result);
      }

      setLoading(false);
    };

    fetchProjects();
    console.log(projects);
  }, [userData]);

  if (loading) {
    return <div className="text-white text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <section className="p-4 text-black">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.projectId} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{project.title} – <span className="italic">{project.status}</span></h2>
              <p className="mt-1">{project.description}</p>
              <p className="mt-1 text-sm text-gray-600">
                Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString("en-US") : "N/A"}
              </p>
              <p className="mt-1">
                Client: {project.client && project.client.length > 0
                  ? project.client.map(c => c.name).join(", ")
                  : "N/A"}
              </p>
              <p className="mt-1">
                Project Manager: {project.manager ? project.manager.name : "N/A"}
              </p>
              <p className="mt-1">
                Issues: {project.issues && project.issues.length > 0
                  ? project.issues[0].issueType
                  : "No issues"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );




};

export default AllProjectsByUser;
