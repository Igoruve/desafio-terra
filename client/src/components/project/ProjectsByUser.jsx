import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";
import { data, useNavigate } from "react-router-dom";
import { deleteProject } from "../../utils/project";
import { deleteIssue } from "../../utils/issue";

const formatDate = (dateObj) => {
  const raw = dateObj?.$date || dateObj;
  return raw ? new Date(raw).toLocaleString() : "N/A";
};

const ProjectsByUser = () => {
  const { userData } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRemoveProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.projectId !== projectId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveIssue = async (projectId, issueId) => {
    try {
      await deleteIssue(projectId, issueId);
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.projectId === projectId) {
            project.issues = project.issues.filter(
              (issue) => issue.issueId !== issueId
            );
          }
          return project;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

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
        console.log("route", route);
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


  const statusBorderColor = {
    "On Hold": "border-[#ffb410]",
    "In Progress": "border-[#3D9DD8]",
    Complete: "border-[#7ce55e]",
    "Post Launch": "border-[#B679F7]",
    "Needs Inputs": "border-[#F77241]",
    "Ready to upload": "border-[#3EE3EB]",
    "Duplicate Comment": "border-[#F78BD8]",
    "N/A": "border-[var(--bg-color)]",
  };

  return (

    <section className="py-18">

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
        {userData.role !== "client" && (
          <div
            className="flex flex-row gap-4 items-center bg-[var(--bg-color)] text-white w-fit px-12 py-6 rounded-[50px] backdrop-blur-md sticky mb-12 left-12 cursor-pointer hover:rounded-[8px] transition-all 300ms ease-in-out"
            onClick={() => navigate(`/newproject`)}
          >
            <div className=" rounded-full w-fit ">
              <img src="/Plus.svg" alt="" className="invert brightness-0 saturate-0" />

            </div>
            <h2 className="text-2xl font-bold">New Project</h2>
          </div>
        )}
        <div className="space-y-12">
          {projects.map((p, index) => (
            <div
              key={p.projectId || p._id || index}
              className="flex flex-col md:flex-row gap-12  "
            >
              <div className="md:w-1/2 bg-[#F7F8F4] rounded-[20px] px-8 py-10 shadow-2xs">
                <div className="grid grid-cols-[1fr_40px] gap-4">
                  <h3 className="text-4xl font-bold">
                    {p.title || "Untitled Project"}
                  </h3>
                  {userData.role === "admin" && (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleRemoveProject(p.projectId)}
                    >
                      <img src="/Trash.svg" alt="" />
                    </div>
                  )}
                </div>
                <p className="pt-2 text-lg text-[var(--bg-color)]">
                  Status: {p.status || "N/A"}
                </p>
                <p className="pt-1 text-lg text-[var(--bg-color)]">
                  Creation Date: {formatDate(p.createdAt)}
                </p>
                <p className="mt-1 text-lg text-[var(--bg-color)]">
                  Client(s):{" "}
                  {p.clients?.length > 0
                    ? p.clients
                      .map((c) => c.name || "Unknown Client")
                      .join(", ")
                    : "None"}
                </p>
                <p className="mt-1 text-lg text-[var(--bg-color)]">
                  Manager: {p.manager?.name || "N/A"}
                </p>
                <p className="pt-2 text-xl">
                  {p.description || "No description"}
                </p>
              </div>

              <div className="md:w-1/2 bg-[#F7F8F4] rounded-[20px] px-8 py-10 shadow-2xs ">
                <div className={`flex justify-end ${userData.role === "project manager" ? "hidden" : ""}`}>

                  <div
                    className="bg-white px-6 py-3 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out rounded-[50px] hover:rounded-[8px] shadow-sm"
                    onClick={() => navigate(`/newissue/${p.projectId}`)}
                  >
                    <img src="/Plus.svg" alt="" />
                    <h4 className="text-2xl font-bold">New Issue</h4>
                  </div>
                </div>

                {p.issues?.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mt-6">
                    {p.issues.map((issue, i) => (
                      <div
                        key={issue._id?.$oid || issue._id || i}
                        className="bg-white p-4 rounded-[30px] shadow-sm  text-sm text-[var(--bg-color)] space-y-1"
                      >
                        <div className="grid grid-cols-[1fr_40px] gap-4">
                          <div className="flex flex-wrap gap-4 text-lg">
                            <p
                              className={` border-3 w-fit rounded-[50px] px-4 py-2 ${statusBorderColor[issue.status] ||
                                "border-[var(--bg-color)]"
                                }`}
                            >
                              Status:{" "}
                              <span className="font-medium">
                                {" "}
                                {issue.status || "N/A"}
                              </span>
                            </p>
                            <p className=" border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                              Type:
                              <span className="font-medium">
                                {" "}
                                {issue.issueType || "N/A"}
                              </span>
                            </p>

                            <p className=" border-3 border-[var(--bg-color)] w-fit rounded-[50px] px-4 py-2">
                              {" "}
                              Created:{" "}
                              <span className="font-medium">
                                {" "}
                                {formatDate(issue.createdAt)}
                              </span>{" "}
                            </p>
                          </div>

                          <div className="w-[40px] max-w-[40px] flex flex-col justify-between">
                            <img
                              src="/See.svg"
                              alt=""
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
                                handleRemoveIssue(p.projectId, issue.issueId)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No issues found for this project.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </section>
  );
};

export default ProjectsByUser;
