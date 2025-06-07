import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const formatDate = (dateObj) => {
  const raw = dateObj?.$date || dateObj;
  return raw ? new Date(raw).toLocaleString() : "N/A";
};

const ProjectsByUser = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userData === null) {
      return;
    }

    if (!userData || !userData.userId || !userData.role) {
      setError("Please log in to view projects.");
      setLoading(false);
      setProjects([]);
      return;
    }

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      setProjects([]);

      try {
        let route = "";
        if (userData.role === "admin") {
           route = "/project";
        } else if (userData.role === "project manager") {
           route = `/project/user/${userData.userId}`;
        } else if (userData.role === "client") {
           route = `/project/user/${userData.userId}`;
        } else {
          setError("Role not recognized.");
          setLoading(false);
          return;
        }

        const result = await FetchData(route);

        if (result.error) {
          setError(result.message || "Error fetching projects");
          setProjects([]);
        } else {
           const projectsData = Array.isArray(result) ? result : result.data || [];
          setProjects(projectsData);
          setError(null);
        }
      } catch (err) {
        setError("Failed to fetch projects");
        setProjects([]);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [userData]);

  if (userData === null) return <div>Loading user data...</div>;
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  if (projects.length === 0)
    return (
      <div
        style={{
          border: "2px solid red",
          padding: "10px",
          marginTop: "5rem",
        }}
      >
        No projects found for your user.
      </div>
    );

  return (
    <div style={{ border: "2px solid red", padding: "10px", marginTop: "5rem" }}>
      <h2>Projects</h2>
      {projects.map((p, index) => (
        <div
          key={p.projectId || p._id || index}
          style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}
        >
          <h3>{p.title || "Untitled Project"}</h3>
          <p>
            <strong>ID:</strong> {p._id?.$oid || p._id || "N/A"}
          </p>
          <p>
            <strong>Project ID:</strong> {p.projectId || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {p.description || "No description"}
          </p>
          <p>
            <strong>Status:</strong> {p.status || "N/A"}
          </p>
          <p>
            <strong>Client(s):</strong>{" "}
            {p.clients?.length > 0
              ? p.clients
                  .map((c) => c.name || c._id?.$oid || c._id || "Unknown Client")
                  .join(", ")
              : "None"}
          </p>
          <p>
            <strong>Manager:</strong>{" "}
            {p.manager
              ? p.manager.name ||
                p.manager._id?.$oid ||
                p.manager._id ||
                "Unknown Manager"
              : "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(p.createdAt)}
          </p>

          <h4>Issues</h4>
          {p.issues?.length > 0 ? (
            <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
              {p.issues.map((issue, i) => (
                <li key={issue._id?.$oid || issue._id || i}>
                  <p>
                    <strong>Issue ID:</strong> {issue.issueId || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {issue.issueType || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {issue.status || "N/A"}
                  </p>
                  <p>
                    <strong>Client:</strong> {issue.client || "N/A"}
                  </p>
                  <p>
                    <strong>Device:</strong> {issue.device || "N/A"}
                  </p>
                  <p>
                    <strong>Browser:</strong> {issue.browser || "N/A"}
                  </p>
                  <p>
                    <strong>Comment:</strong> {issue.clientComment || "No comment available"}
                  </p>
                  <p>
                    <strong>Page:</strong> {issue.page || "N/A"}
                  </p>
                  <p>
                    <strong>Created At:</strong> {formatDate(issue.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No issues found for this project.</p>
          )}
        </div>
      ))}
    </div>
  );

};

export default ProjectsByUser;
