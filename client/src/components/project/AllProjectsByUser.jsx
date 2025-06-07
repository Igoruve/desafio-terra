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
      } else if (userData.role === "clients" || userData.role === "pm") {
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
    <section className="pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[250px] font-bold mb-4 leading-[.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          my
          <br />
          projects
        </h2>

        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end  pr-8">
          <p className="text-2xl">Manage your projects</p>
        </div>
      </header>

      <main className="px-24 py-42 text-black">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.projectId}
                className=" px-8 py-10 rounded-[20px] shadow-2xs bg-[#F7F8F4]"
              >
                <h2 className="text-6xl font-black">{project.title}</h2>
                <p className="italic">{project.status}</p>
                <p className="mt-1">{project.description}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Created:{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString("en-US")
                    : "N/A"}
                </p>
                <p className="mt-1">
                  Client:{" "}
                  {project.clients && project.clients.length > 0
                    ? project.clients.map((c) => c.name).join(", ")
                    : "N/A"}
                </p>
                <p className="mt-1">
                  Project Manager:{" "}
                  {project.manager ? project.manager.name : "N/A"}
                </p>
                <p className="mt-1">
                  Issues:{" "}
                  {project.issues && project.issues.length > 0
                    ? project.issues[0].issueType
                    : "No issues"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );
};

export default AllProjectsByUser;
