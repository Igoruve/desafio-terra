import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const issueTypes = [
  "Copy revision",
  "Requested Change",
  "New Item",
  "Bug Fix",
  "Design Issues",
  "Not Addressing",
  "Other",
];

const statusOptions = [
  "On Hold",
  "In Progress",
  "Complete",
  "Post Launch",
  "Needs Inputs",
  "Ready to upload",
  "Duplicate Comment",
  "N/A",
];

const deviceOptions = ["Desktop", "Mobile", "Tablet"];

const EditIssue = () => {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [formData, setFormData] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [managerProjectIds, setManagerProjectIds] = useState([]); // Added for project manager project IDs

  useEffect(() => {
    const fetchIssues = async () => {
      if (!userData?.userId || !userData?.role) {
        setError("You must be logged in. Please log in and try again.");
        setLoading(false);
        navigate("/projects");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        let issuesData = [];
        let projectIds = [];
        if (userData.role === "admin") {
          // Para admin: obtener todos los issues
          const data = await FetchData("/issue/");
          console.log("Admin issues response:", data);
          if (data.error || data.status >= 400) {
            throw new Error(data.message || `Failed to fetch issues: ${data.status || 'Unknown status'}`);
          }
          if (!Array.isArray(data)) {
            throw new Error(`Unexpected response format: Response is not an array, received ${JSON.stringify(data)}`);
          }
          issuesData = data;
        } else if (userData.role === "client") {
          // Para client: obtener issues creados por ellos
          const data = await FetchData(`/issue/user/${userData._id}`);
          console.log("Client issues response:", data);
          if (data.error || data.status >= 400) {
            throw new Error(data.message || `Failed to fetch issues: ${data.status || 'Unknown status'}`);
          }
          if (!Array.isArray(data)) {
            throw new Error(`Unexpected response format: Response is not an array, received ${JSON.stringify(data)}`);
          }
          issuesData = data;
        } else if (userData.role === "project manager") {
          // Para project manager: obtener issues de sus proyectos asignados
          const projectsData = await FetchData(`/project?manager=${userData._id}`);
          console.log("Project manager projects response:", projectsData);
          if (projectsData.error || projectsData.status >= 400) {
            throw new Error(projectsData.message || `Failed to fetch projects: ${projectsData.status || 'Unknown status'}`);
          }
          if (!Array.isArray(projectsData)) {
            throw new Error(`Unexpected projects response format: Response is not an array, received ${JSON.stringify(projectsData)}`);
          }
          projectIds = projectsData.map(project => project.projectId);
          console.log("Project IDs for PM:", projectIds);
          setManagerProjectIds(projectIds); // Store project IDs
          if (projectIds.length > 0) {
            // Obtener issues para los projectId
            const issuesResponse = await FetchData("/issue/", "POST", { projectIds });
            console.log("Project manager issues response:", issuesResponse);
            if (issuesResponse.error || issuesResponse.status >= 400) {
              throw new Error(issuesResponse.message || `Failed to fetch issues: ${issuesResponse.status || 'Unknown status'}`);
            }
            if (!Array.isArray(issuesResponse)) {
              throw new Error(`Unexpected issues response format: Response is not an array, received ${JSON.stringify(issuesResponse)}`);
            }
            issuesData = issuesResponse;
          } else {
            issuesData = []; // No hay proyectos asignados
          }
        } else {
          setError("Unauthorized access. Your role does not permit viewing issues.");
          setLoading(false);
          navigate("/projects");
          return;
        }

        setIssues(issuesData);
      } catch (err) {
        setError(err.message || "Failed to fetch issues. Check console for details.");
        console.error("Fetch issues error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userData, navigate]);

  const handleEditClick = (issue) => {
    setSelectedIssue(issue);
    setFormData({
      issueType: issue.issueType || "",
      status: issue.status || "On Hold",
      device: issue.device || "Desktop",
      browser: issue.browser || "",
      clientComment: issue.clientComment || "",
      page: issue.page || "",
      terraComments: issue.terraComments || "",
      screenshot: issue.screenshot || "",
    });
    setTouchedFields({});
    setMessage(null);
  };

  const handleFocus = (field) => {
    if (!touchedFields[field]) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    if (!formData[field] && selectedIssue) {
      setFormData((prev) => ({
        ...prev,
        [field]: selectedIssue[field] || "",
      }));
      setTouchedFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedIssue) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    let dataToSend;
    let headers = {};

    if (formData.screenshot && typeof formData.screenshot !== "string") {
      dataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          if (key === "screenshot" && val instanceof File) {
            dataToSend.append(key, val);
          } else {
            dataToSend.append(key, val);
          }
        }
      });
    } else {
      dataToSend = { ...formData };
      if (dataToSend.screenshot && typeof dataToSend.screenshot !== "string") {
        delete dataToSend.screenshot;
      }
    }

    try {
      const data = await FetchData(
        `/issue/${selectedIssue.issueId}/edit`,
        "PUT",
        dataToSend
      );

      if (data.error) {
        throw new Error(data.message || "Update failed");
      }

      setIssues((prev) =>
        prev.map((issue) =>
          (issue._id?.$oid || issue._id) === (selectedIssue._id?.$oid || selectedIssue._id)
            ? { ...issue, ...data }
            : issue
        )
      );

      setSelectedIssue(null);
      setMessage({ type: "success", text: "Issue updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update issue" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-4">Loading issues...</div>;

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Edit Issues</h2>

      {message && (
        <div
          className={`mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <ul className="space-y-2 mb-8 w-full max-w-lg">
        {issues.length === 0 && <li>No issues assigned to you. Contact support if this is unexpected.</li>}
        {issues.map((issue, index) => (
          <li key={issue._id?.$oid || issue._id || index}>
            <button
              onClick={() => handleEditClick(issue)}
              className="underline text-[#7ce55b] hover:text-[#a1f48d] text-lg font-semibold"
            >
              {issue.issueId || "(No ID)"} - {issue.clientComment || "Edit Issue"}
            </button>
          </li>
        ))}
      </ul>

      {selectedIssue && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-4 w-full max-w-lg border-3 border-[#F78BD8] rounded-xl p-6"
        >
          <div className="w-full">
            <p className="font-bold">
              <strong>Issue ID:</strong> {selectedIssue.issueId}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="issueType">
              Issue Type:
            </label>
            <select
              id="issueType"
              name="issueType"
              value={formData.issueType}
              onFocus={() => handleFocus("issueType")}
              onBlur={() => handleBlur("issueType")}
              onChange={handleChange}
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
              required
            >
              <option value="" disabled>
                Select issue type
              </option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {(userData.role === "admin" ||
            (userData.role === "project manager" &&
              managerProjectIds.includes(selectedIssue?.projectId))) ? (
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="status">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onFocus={() => handleFocus("status")}
                onBlur={() => handleBlur("status")}
                onChange={handleChange}
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                required
              >
                <option value="" disabled>
                  Select status
                </option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="mb-1">Status:</label>
              <p className="bg-gray-800 border-3 border-white rounded-[20px] px-4 py-2">
                {formData.status}
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="device">
              Device:
            </label>
            <select
              id="device"
              name="device"
              value={formData.device}
              onFocus={() => handleFocus("device")}
              onBlur={() => handleBlur("device")}
              onChange={handleChange}
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
              required
            >
              <option value="" disabled>
                Select device
              </option>
              {deviceOptions.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="browser">
              Browser:
            </label>
            <input
              id="browser"
              name="browser"
              value={formData.browser}
              onFocus={() => handleFocus("browser")}
              onBlur={() => handleBlur("browser")}
              onChange={handleChange}
              type="text"
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
              required
            />
          </div>

          {selectedIssue?.createdBy === userData._id && userData.role === "client" ? (
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="clientComment">
                Client Comment:
              </label>
              <textarea
                id="clientComment"
                name="clientComment"
                value={formData.clientComment}
                onFocus={() => handleFocus("clientComment")}
                onBlur={() => handleBlur("clientComment")}
                onChange={handleChange}
                rows={3}
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white resize-none"
                required
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="mb-1">Client Comment:</label>
              <p className="bg-gray-800 border-3 border-white rounded-[20px] px-4 py-2">
                {formData.clientComment}
              </p>
            </div>
          )}

          {(userData.role === "admin" || userData.role === "project manager") && (
            <div className="flex flex-col">
              <label className="mb-1" htmlFor="terraComments">
                Terra Comments:
              </label>
              <textarea
                id="terraComments"
                name="terraComments"
                value={formData.terraComments}
                onFocus={() => handleFocus("terraComments")}
                onBlur={() => handleBlur("terraComments")}
                onChange={handleChange}
                rows={3}
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white resize-none"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="page">
              Page:
            </label>
            <input
              id="page"
              name="page"
              value={formData.page}
              onFocus={() => handleFocus("page")}
              onBlur={() => handleBlur("page")}
              onChange={handleChange}
              type="text"
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1" htmlFor="screenshot">
              Screenshot (upload new):
            </label>
            <input
              id="screenshot"
              name="screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  screenshot: e.target.files[0] || null,
                }));
              }}
              className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
            />
            {typeof formData.screenshot === "string" && formData.screenshot && (
              <img
                src={formData.screenshot}
                alt="Screenshot"
                className="mt-2 max-h-40 rounded-md border border-white"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-xl bg-[#F78BD8] px-6 py-3 font-bold text-black hover:bg-[#E85DE6]"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedIssue(null)}
            className="mt-2 rounded-xl bg-gray-700 px-6 py-3 font-bold text-white hover:bg-gray-800"
          >
            Cancel
          </button>
        </form>
      )}
    </section>
  );
};

export default EditIssue;