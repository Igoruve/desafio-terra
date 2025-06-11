import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const EditProjectPM = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const isManager = userData?.role === "project manager";

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData || !isManager) {
      setLoading(false);
      navigate("/projects");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setMessage(null);

      try {
        const projectsResult = await FetchData(
          `/project?manager=${userData._id}`
        );
        setProjects(Array.isArray(projectsResult) ? projectsResult : []);
      } catch (error) {
        setMessage({ type: "error", text: "Error fetching projects." });
        setProjects([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [userData, isManager]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "In Progress",
    });
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedProject?.projectId) {
      setMessage({ type: "error", text: "No project selected." });
      return;
    }

    if (!formData.title || !formData.description) {
      setMessage({ type: "error", text: "Fill all required fields." });
      return;
    }

    const payload = {
      projectId: selectedProject.projectId,
      title: formData.title,
      description: formData.description,
      status: formData.status,
    };

    try {
      const response = await FetchData(
        `/project/${selectedProject.projectId}`,
        "PUT",
        payload
      );
      if (response.error || response.status >= 400) {
        setMessage({
          type: "error",
          text: response.message || "Error updating project.",
        });
      } else {
        setMessage({ type: "success", text: "Project updated successfully." });
        setProjects((prev) =>
          prev.map((p) =>
            p.projectId === selectedProject.projectId ? response : p
          )
        );
        setSelectedProject(response);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update project." });
    }
  };

  if (loading)
    return (
      <div className="text-[var(--bg-color)] p-4">Loading projects...</div>
    );

  if (!userData || !isManager) {
    return (
      <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--bg-color)] pt-20 px-4 min-h-screen">
        <p className="text-red-500 text-lg">
          Only project managers can access this page.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center bg-white text-[var(--bg-color)] pt-20 px-4 min-h-screen text-2xl">
      {message && (
        <div
          className={`mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <ul className="w-full max-w-lg mb-8 overflow-auto max-h-48">
        {projects.length === 0 ? (
          <li className="p-4 text-center text-gray-300">
            No projects available.
          </li>
        ) : (
          projects.map((project) => (
            <li key={project._id} className="mb-2 last:mb-0">
              <button
                type="button"
                onClick={() => handleSelectProject(project)}
                className="w-full text-left px-4 py-3 border-3 border-[var(--bg-color)] rounded-[50px] text-[var(--bg-color)] font-semibold cursor-pointer hover:rounded-[8px] hover:bg-[var(--bg-color)] hover:text-white transition-background duration-300 ease-in-out"
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
          className="flex flex-col gap-8 w-full max-w-lg border-3 border-[var(--bg-color)] rounded-xl p-6 min-h-[500px] text-[var(--bg-color)]"
        >
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 font-bold">
              Title:
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none bg-white border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 "
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="mb-1 font-bold">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="appearance-none bg-white border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-bold">
              Status:
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-white border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 "
            >
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[var(--bg-color)] text-white py-2 rounded-[50px] font-bold cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
          >
            Update Project
          </button>
        </form>
      )}
    </section>
  );
};

export default EditProjectPM;
