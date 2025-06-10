import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const EditProjectAdmin = () => {
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
    if (!userData || !isAdmin) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        // Get projects
        const projectsResult = await FetchData("/project");
        setProjects(Array.isArray(projectsResult) ? projectsResult : []);

        // Get users (clients and project managers)
        const usersResult = await FetchData("/user");
        console.log("Raw usersResult:", usersResult); // Log para depuración
        if (usersResult.error || usersResult.status >= 400) {
          throw new Error(usersResult.message || `Error fetching users: ${usersResult.status}`);
        }
        const usersArray = Array.isArray(usersResult) ? usersResult : usersResult.data || [];
        console.log("Filtered roles:", usersArray.map(user => user.role)); // Log para verificar roles
        setUsers(usersArray.filter(user => user.role === "client" || user.role === "project manager"));
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage({ type: "error", text: error.message || "Error fetching data." });
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
      clients: project.clients?.map(c => c._id) || [],
      clientsManual: "",
      manager: project.manager?._id || "",
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData(prev => ({ ...prev, clients: selected }));
  };

  const handleManualClientsChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map(id => id.trim())
      .filter(id => id);
    setFormData(prev => ({ ...prev, clientsManual: e.target.value, clients: ids }));
  };

  const handleManagerChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, manager: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedProject?.projectId) {
      setMessage({ type: "error", text: "No project selected." });
      return;
    }

    if (!formData.title || !formData.description || !formData.clients.length || !formData.manager) {
      setMessage({ type: "error", text: "Fill all required fields." });
      return;
    }

    if (!formData.clients.every(isValidObjectId)) {
      setMessage({ type: "error", text: "Invalid client ID(s)." });
      return;
    }

    if (!isValidObjectId(formData.manager)) {
      setMessage({ type: "error", text: "Invalid manager ID." });
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
      if (response.error || response.status >= 400) {
        setMessage({ type: "error", text: response.message || "Error updating project." });
      } else {
        setMessage({ type: "success", text: "Project updated successfully." });
        setProjects(prev => prev.map(p => (p.projectId === selectedProject.projectId ? response : p)));
        setSelectedProject(response);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update project." });
    }
  };

  if (loading) return <div className="text-white p-4">Loading projects...</div>;

  if (!userData || !isAdmin) {
    return (
      <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
        <p className="text-red-500 text-lg">Only administrators can access this page.</p>
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
            {users.filter(user => user.role === "client").length > 0 ? (
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
                <ul className="text-white list-disc list-inside ml-2">
                  {selectedProject.clients?.map(client => (
                    <li key={client._id}>{client.name || client.email || client._id}</li>
                  ))}
                </ul>
                <label htmlFor="clientsManual" className="mt-2 mb-1">
                  Manual Client IDs (comma-separated):
                </label>
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
            {users.filter(user => user.role === "project manager").length > 0 ? (
              <select
                name="manager"
                value={formData.manager}
                onChange={handleManagerChange}
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
            ) : (
              <p className="text-red-500">No project managers available. Check console for details.</p>
            )}
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

export default EditProjectAdmin;