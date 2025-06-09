import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const EditProject = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const isAdmin = userData?.role === "admin";

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    console.log("User data:", { userData, isAdmin });

    if (!userData || !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        // Fetch projects
        const projectsResult = await FetchData("/project");
        console.log("Response GET /project:", projectsResult);

        if (projectsResult.error || projectsResult.status >= 400) {
          setMessage({
            type: "error",
            text: projectsResult.message || "Error loading projects.",
          });
          setProjects([]);
          setLoading(false);
          return;
        }

        if (!Array.isArray(projectsResult)) {
          setMessage({ type: "error", text: "Invalid response for projects." });
          setProjects([]);
          setLoading(false);
          return;
        }

        setProjects(projectsResult);

        // Fetch users
        const usersResult = await FetchData("/user");
        console.log("Response GET /user:", usersResult);

        if (usersResult.error || usersResult.status >= 400) {
          if (usersResult.status === 403) {
            setMessage({ type: "error", text: "Access denied to users. Using project clients." });
          } else {
            setMessage({
              type: "error",
              text: usersResult.message || "Error loading users.",
            });
          }
          setUsers([]);
        } else if (Array.isArray(usersResult)) {
          setUsers(usersResult);
        } else {
          setMessage({ type: "error", text: "Invalid response for users." });
          setUsers([]);
        }
      } catch (error) {
        console.error("Unexpected error in fetch:", error);
        setMessage({ type: "error", text: "Unexpected error occurred while fetching data." });
        setProjects([]);
        setUsers([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [userData, isAdmin]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "In Progress",
      clients: project.clients?.map(client => client._id) || [],
      manager: project.manager?._id || "",
      clientsManual: "",
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ajuste en el manejo de selección de clients
  const handleClientsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions
      .map(option => option.value)
      .filter(id => typeof id === "string" && id.trim() !== "");
    console.log("Selected clients IDs:", selectedIds);
    setFormData(prev => ({ ...prev, clients: selectedIds }));
  };

  const handleManualClientsChange = (e) => {
    const ids = e.target.value.split(",").map(id => id.trim()).filter(id => id);
    setFormData(prev => ({ ...prev, clientsManual: e.target.value, clients: ids }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedProject || !selectedProject.projectId) {
      setMessage({ type: "error", text: "Select a valid project with projectId." });
      return;
    }

    if (!formData.title || !formData.description || !formData.clients.length || !formData.manager) {
      setMessage({ type: "error", text: "All required fields must be filled." });
      return;
    }

    if (!isValidObjectId(formData.manager)) {
      setMessage({ type: "error", text: "Invalid Manager ObjectId." });
      return;
    }

    if (!formData.clients.every(id => isValidObjectId(id))) {
      setMessage({ type: "error", text: "One or more Client ObjectIds are invalid." });
      return;
    }

    const payload = {
      projectId: selectedProject.projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      clients: formData.clients,
      manager: formData.manager,
    };

    try {
      const response = await FetchData(`/project/${selectedProject.projectId}`, "PUT", payload);
      console.log("Response PUT /project:", response);
      if (response.error || response.status >= 400) {
        setMessage({ type: "error", text: response.message || "Error updating project." });
      } else {
        setMessage({ type: "success", text: "Project updated successfully." });
        setProjects(prev =>
          prev.map(p => (p.projectId === selectedProject.projectId ? response : p))
        );
        setSelectedProject(response);
      }
    } catch (error) {
      console.error("Error in PUT /project:", error);
      setMessage({ type: "error", text: "Failed to update project." });
    }
  };

  if (loading) return <div className="text-white p-4">Loading projects...</div>;

  if (!isAdmin) {
    return (
      <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
        <p className="text-red-500 text-lg">You do not have permission to view projects.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Edit Projects</h2>

      {message && (
        <div className={`mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </div>
      )}

      <ul className="w-full max-w-lg mb-8 overflow-auto max-h-48">
        {projects.length === 0 ? (
          <li className="p-4 text-center text-gray-300">No projects available.</li>
        ) : (
          projects.map(project => (
            <li key={project._id} className="mb-2 last:mb-0">
              <button
                type="button"
                onClick={() => handleSelectProject(project)}
                className="w-full text-left px-4 py-3 border-3 border-[#F78BD8] rounded-[50px] text-white font-semibold cursor-pointer hover:rounded-[8px] hover:bg-[#F78BD8] hover:text-black transition-background duration-300 ease-in-out"
              >
                {project.title || "No title"}
              </button>
            </li>
          ))
        )}
      </ul>

      {selectedProject && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-lg border-3 border-[#F78BD8] rounded-xl p-6 min-h-[600px]"
        >
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="mb-1">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
            >
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="clients" className="mb-1">Clients:</label>
            {users.length > 0 ? (
              <select
                name="clients"
                multiple
                value={formData.clients}
                onChange={handleClientsChange}
                className="bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
              >
                {users
                  .filter(user => user.role === "client")
                  .map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name || user.email || "Unknown"}
                    </option>
                  ))}
              </select>
            ) : (
              <>
                <select
                  name="clients"
                  multiple
                  value={formData.clients}
                  onChange={handleClientsChange}
                  className="bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                >
                  {selectedProject.clients?.map(client => (
                    <option key={client._id} value={client._id}>
                      {client.name || client.email || "Unknown"}
                    </option>
                  ))}
                </select>
                <label htmlFor="clientsManual" className="mt-2 mb-1">Manual Client IDs (comma-separated):</label>
                <input
                  type="text"
                  name="clientsManual"
                  value={formData.clientsManual}
                  onChange={handleManualClientsChange}
                  className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                  placeholder="ObjectId1, ObjectId2, ..."
                />
              </>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="manager" className="mb-1">Project Manager:</label>
            <select
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              className="bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
            >
              <option value="">-- Select a Manager --</option>
              {users
                .filter(user => user.role === "project manager")
                .map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.email || "Unknown"}
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#F78BD8] text-black py-2 rounded-xl font-bold hover:bg-[#d069bb] transition-colors duration-300"
          >
            Update Project
          </button>
        </form>
      )}
    </section>
  );
};

export default EditProject;
