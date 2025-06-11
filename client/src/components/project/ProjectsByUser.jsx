import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../../utils/project";
import { deleteIssue } from "../../utils/issue";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";

const formatDate = (dateObj) => {
  const raw = dateObj?.$date || dateObj;
  if (!raw) return "N/A";
  const date = new Date(raw);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

const getProgressFromStatus = (status) => {
  switch (status) {
    case "Complete":
      return 100;
    case "In Progress":
      return 50;
    case "On Hold":
      return 25;
    case "Cancelled":
      return 10;
    default:
      return 0;
  }
};

const getBarColor = (percentage) => {
  if (percentage === 100) return "bg-[#7ce55e]";
  if (percentage >= 50) return "bg-[#ffb410]";
  if (percentage > 0) return "bg-[#F77241]";
  return "bg-red-500";
};

const ProgressBar = ({ percentage }) => {
  const barColor = getBarColor(percentage);

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full ${barColor} transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const ProjectsByUser = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    onConfirm: () => {},
    message: "",
  });

  const handleRemoveProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) =>
            project.projectId !== projectId && project._id !== projectId
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  };

  const handleRemoveIssue = async (projectId, issueId) => {
    try {
      await deleteIssue(issueId);
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.projectId === projectId || project._id === projectId) {
            return {
              ...project,
              issues: project.issues.filter(
                (issue) => issue.issueId !== issueId
              ),
            };
          }
          return project;
        })
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete issue");
    }
  };

  const confirmDelete = (message, onConfirm) => {
    setModalConfig({ message, onConfirm });
    setModalOpen(true);
  };

  useEffect(() => {
    if (userData === null) return;

    if (!userData.userId || !userData.role) {
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
        } else if (["project manager", "client"].includes(userData.role)) {
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
          const projectsData = (
            Array.isArray(result) ? result : result.data || []
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          projectsData.forEach((project) => {
            if (Array.isArray(project.issues)) {
              project.issues.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
            }
          });

          setProjects(projectsData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects");
        setProjects([]);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [userData]);

  const statusBorderColor = {
    "On Hold": "border-[#3D9DD8]",
    "In Progress": "border-[#ffb410]",
    Complete: "border-[#7ce55e]",
    "Post Launch": "border-[#B679F7]",
    "Needs Inputs": "border-[#F77241]",
    "Ready to upload": "border-[#3EE3EB]",
    "Duplicate Comment": "border-[#F78BD8]",
    "N/A": "border-[var(--bg-color)]",
  };

  if (userData === null)
    return (
      <div className="text-white text-center py-4">Loading user data...</div>
    );
  if (loading)
    return (
      <div className="text-white text-center py-4">Loading projects...</div>
    );
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <section className="py-18">
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          modalConfig.onConfirm();
          setModalOpen(false);
        }}
        message={modalConfig.message}
      />

      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          my
          <br />
          projects
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Manage your projects</p>
        </div>
      </header>

      <main className="px-8 md:px-24 py-12 text-black">
        <section className="flex sm:flex-row flex-col gap-4 justify-between items-center mb-12">
          {userData.role !== "client" && (
            <div className="flex sm:flex-row flex-col gap-4">
              <div
                className="flex flex-row gap-4 items-center  bg-[var(--bg-color)] text-white w-fit px-12 py-6 rounded-[50px] backdrop-blur-md sticky left-12 cursor-pointer hover:rounded-[8px] transition-all 300ms ease-in-out"
                onClick={() => navigate(`/newproject`)}
              >
                <img
                  src="/Plus.svg"
                  alt=""
                  className="invert brightness-0 saturate-0"
                />
                <h2 className="text-2xl font-bold">New Project</h2>
              </div>
             
                <div
                  className="cursor-pointer flex flex-row gap-4 items-center  bg-[var(--bg-color)] text-white w-fit px-12 py-6 rounded-[50px] backdrop-blur-md sticky left-12 hover:rounded-[8px] transition-all 300ms ease-in-out text-2xl font-bold"
                  onClick={() => navigate(`/project/edit`)}
                >
                  <img src="/Edit.svg" alt="Delete project" />
                  <h2>Edit projects</h2>
                </div>
            </div>
          )}  
        </section>

        <div className="space-y-12">
          {projects.map((p, index) => {
            const isCancelled = p.status === "Cancelled";

            return (
              <div
                key={p.projectId || p._id || index}
                className={`flex flex-col md:flex-row gap-12 ${
                  isCancelled ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <div className="md:w-1/2 bg-[#F7F8F4] rounded-[20px] px-8 py-10 shadow-2xs">
                  <div className="grid grid-cols-[1fr_40px] gap-4">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold pb-6 break-words whitespace-pre-wrap overflow-hidden max-w-full">
                      {p.title || "Untitled Project"}
                    </h3>

                    {userData.role === "admin" && !isCancelled && (
                      <section className="flex flex-col gap-6">
                        <div
                          className="cursor-pointer"
                          onClick={() =>
                            confirmDelete(
                              "Are you sure you want to delete this project? All issues and progress will be lost.",
                              () => handleRemoveProject(p.projectId || p._id)
                            )
                          }
                        >
                          <img src="/Trash.svg" alt="Delete project" />
                        </div>
                      </section>
                    )}
                  </div>
                  <div>
                    <p
                      className={`border-3 w-fit rounded-[50px] px-4 py-2 text-lg ${
                        statusBorderColor[p.status] ||
                        "border-[var(--bg-color)]"
                      }`}
                    >
                      Status: {p.status || "N/A"}
                    </p>
                    <div className="mt-4">
                      <ProgressBar
                        percentage={getProgressFromStatus(p.status)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-8">
                    <p className="border-3 border-[var(--bg-color)]/30 w-fit rounded-[50px] px-4 py-2">
                      Creation Date: {formatDate(p.createdAt)}
                    </p>
                    <p className="border-3 border-[var(--bg-color)]/30 w-fit rounded-[50px] px-4 py-2">
                      Client(s):{" "}
                      {p.clients?.length > 0
                        ? p.clients
                            .map((c) => c.name || "Unknown Client")
                            .join(", ")
                        : "None"}
                    </p>
                    <p className="border-3 border-[var(--bg-color)]/30 w-fit rounded-[50px] px-4 py-2">
                      Manager: {p.manager?.name || "N/A"}
                    </p>
                  </div>
                  <div className="mt-8 text-xl flex flex-col gap-2">
                    <p>Description:</p>
                    <p className="break-words whitespace-pre-wrap">
                      {p.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="md:w-1/2 bg-[#F7F8F4] rounded-[20px] px-8 py-10 shadow-2xs">
                  {!isCancelled && userData.role !== "project manager" && (
                    <div className="flex justify-end">
                      <div
                        className="bg-white px-6 py-3 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out rounded-[50px] hover:rounded-[8px] shadow-sm"
                        onClick={() => navigate(`/newissue/${p.projectId}`)}
                      >
                        <img src="/Plus.svg" alt="Add Issue" />
                        <h4 className="text-2xl font-bold">New Issue</h4>
                      </div>
                    </div>
                  )}

                  {p.issues?.length > 0 ? (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mt-6">
                      {p.issues.map((issue, i) => (
                        <div
                          key={issue._id?.$oid || issue._id || i}
                          className="bg-white p-4 rounded-[30px] shadow-sm text-sm text-[var(--bg-color)] space-y-1"
                        >
                          <div className="grid grid-cols-[1fr_40px] gap-4">
                            <div className="flex flex-wrap gap-4 text-lg">
                              <p
                                className={`border-3 w-fit rounded-[50px] px-4 py-2 ${
                                  statusBorderColor[issue.status] ||
                                  "border-[var(--bg-color)]"
                                }`}
                              >
                                Status:
                                <span className="font-medium">
                                  {" "}
                                  {issue.status || "N/A"}
                                </span>
                              </p>
                              <div className="mt-2">
                                <ProgressBar
                                  percentage={getProgressFromStatus(
                                    issue.status
                                  )}
                                />
                              </div>
                              <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                                Type:
                                <span className="font-medium">
                                  {" "}
                                  {issue.issueType || "N/A"}
                                </span>
                              </p>
                              <p className="border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                                Created:
                                <span className="font-medium">
                                  {" "}
                                  {formatDate(issue.createdAt)}
                                </span>
                              </p>
                            </div>

                            {!isCancelled && (
                              <div className="w-[40px] max-w-[40px] flex flex-col justify-between">
                                <img
                                  src="/See.svg"
                                  alt="View"
                                  className="cursor-pointer w-[24px] h-[24px]"
                                  onClick={() =>
                                    navigate(`/issue/${issue.issueId}`)
                                  }
                                />
                                <img
                                  src="/Trash.svg"
                                  alt="Delete"
                                  className="cursor-pointer w-[24px] h-[24px]"
                                  onClick={() =>
                                    confirmDelete(
                                      "Are you sure you want to delete this issue?",
                                      () =>
                                        handleRemoveIssue(
                                          p.projectId || p._id,
                                          issue.issueId
                                        )
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">
                      No issues found for this project.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </section>
  );
};

export default ProjectsByUser;
