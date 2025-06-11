import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";
import Arrow from "../createIssueForm/Arrow";

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
  "Other",
];

const deviceOptions = ["Desktop", "Mobile", "Tablet"];

const EditIssue = () => {
  const { userData } = useContext(AuthContext);
  //const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [managerProjectIds, setManagerProjectIds] = useState([]);
  const [screenshotFile, setScreenshotFile] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      if (!userData?.userId || !userData?.role) {
        setError("You must be logged in. Please log in and try again.");
        setLoading(false);
        //navigate("/issues");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        let issuesData = [];
        let projectIds = [];
        if (userData.role === "admin") {
          const data = await FetchData("/issue/");
          if (data.error || data.status >= 400) {
            throw new Error(
              data.message ||
                `Failed to fetch issues: ${data.status || "Unknown status"}`
            );
          }
          if (!Array.isArray(data)) {
            throw new Error(
              `Unexpected response format: ${JSON.stringify(data)}`
            );
          }
          issuesData = data;
        } else if (userData.role === "client") {
          const data = await FetchData(`/issue/user/${userData._id}`);
          if (data.error || data.status >= 400) {
            throw new Error(
              data.message ||
                `Failed to fetch issues: ${data.status || "Unknown status"}`
            );
          }
          if (!Array.isArray(data)) {
            throw new Error(
              `Unexpected response format: ${JSON.stringify(data)}`
            );
          }
          issuesData = data;
        } else if (userData.role === "project manager") {
          const projectsData = await FetchData(
            `/project?manager=${userData._id}`
          );
          if (projectsData.error || projectsData.status >= 400) {
            throw new Error(
              projectsData.message ||
                `Failed to fetch projects: ${
                  projectsData.status || "Unknown status"
                }`
            );
          }
          if (!Array.isArray(projectsData)) {
            throw new Error(
              `Unexpected projects response format: ${JSON.stringify(
                projectsData
              )}`
            );
          }
          projectIds = projectsData.map((project) => project.projectId);
          setManagerProjectIds(projectIds);
          if (projectIds.length > 0) {
            const issuesResponse = await FetchData(
              "/issue/byProjects",
              "POST",
              { projectIds }
            );
            if (issuesResponse.error || issuesResponse.status >= 400) {
              throw new Error(
                issuesResponse.message ||
                  `Failed to fetch issues: ${
                    issuesResponse.status || "Unknown status"
                  }`
              );
            }
            if (!Array.isArray(issuesResponse)) {
              throw new Error(
                `Unexpected issues response format: ${JSON.stringify(
                  issuesResponse
                )}`
              );
            }
            issuesData = issuesResponse;
          }
        } else {
          setError(
            "Unauthorized access. Your role does not permit viewing issues."
          );
          setLoading(false);
          //navigate("/issues");
          return;
        }
        setIssues(issuesData);
      } catch (err) {
        setError(err.message || "Failed to fetch issues.");
        console.error("Fetch issues error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userData /* , navigate */]);

  const handleEditClick = (issue) => {
    setSelectedIssue(issue);
    setFormData({
      issueType: issue.issueType || "",
      status:
        userData.role !== "client" ? issue.status || "On Hold" : undefined,
      device: issue.device || "Desktop",
      browser: issue.browser || "",
      clientComment:
        userData.role === "client" ? issue.clientComment || "" : undefined,
      page: issue.page || "",
      terraComments:
        userData.role !== "client" ? issue.terraComments || "" : undefined,
    });
    setScreenshotFile(null);
    setMessage(null);
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

    try {
      // Log para depuraciÃ³n
      console.log("Selected issue:", {
        issueId: selectedIssue.issueId,
        _id: selectedIssue._id?.$oid || selectedIssue._id,
        formData,
        screenshotFile: screenshotFile ? screenshotFile.name : null,
      });

      // Subir screenshot si existe
      if (screenshotFile) {
        const screenshotData = new FormData();
        screenshotData.append("screenshot", screenshotFile);
        console.log("Sending screenshot to PUT /:id/screenshot:");
        for (let [key, value] of screenshotData.entries()) {
          console.log(
            `FormData ${key}:`,
            value instanceof File ? value.name : value
          );
        }

        const screenshotResponse = await FetchData(
          `/issue/${selectedIssue._id?.$oid || selectedIssue._id}/screenshot`,
          "PUT",
          screenshotData
        );
        console.log("Screenshot response:", screenshotResponse);

        if (screenshotResponse.error || screenshotResponse.status >= 400) {
          throw new Error(
            screenshotResponse.message || "Failed to update screenshot"
          );
        }
      }

      // Preparar datos para actualizar el issue
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          dataToSend.append(key, val);
        }
      });

      console.log("Sending issue data to POST /:id/edit:");
      for (let [key, value] of dataToSend.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const issueResponse = await FetchData(
        `/issue/${selectedIssue.issueId}/edit`,
        "POST", // Cambiado de PUT a POST
        dataToSend
      );
      console.log("Issue response:", issueResponse);

      if (issueResponse.error || issueResponse.status >= 400) {
        throw new Error(
          issueResponse.message ||
            `Failed to update issue: ${issueResponse.status}`
        );
      }

      setIssues((prev) =>
        prev.map((issue) =>
          (issue._id?.$oid || issue._id) ===
          (selectedIssue._id?.$oid || selectedIssue._id)
            ? { ...issue, ...issueResponse }
            : issue
        )
      );

      setSelectedIssue(null);
      setScreenshotFile(null);
      setMessage({ type: "success", text: "Issue updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update issue",
      });
      console.error("Edit issue error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-4">Loading issues...</div>;

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <section className="flex flex-col bg-white pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3 mb-8">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          edit
          <br />
          issues
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Modify existing issues</p>
        </div>
      </header>

      {message && (
        <div
          className={`mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <ul className="space-y-2 mb-8 w-full max-w-md mx-auto text-base sm:text-xl">
        {issues.length === 0 && (
          <li>
            No issues assigned to you. Contact support if this is unexpected.
          </li>
        )}
        {issues.map((issue, index) => (
          <li key={issue._id?.$oid || issue._id || index}>
            <button
              onClick={() => handleEditClick(issue)}
              className=" text-2xl font-semibold border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 hover:bg-[var(--bg-color)] hover:text-white cursor-pointer transition-all 300ms ease-in-out min-w-full"
            >
              Issue ID: {issue.issueId || "(No ID)"}
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
          className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto text-base sm:text-xl"
        >
          {/* Issue Details */}
          <fieldset className="w-full px-8 py-4 border-5 border-[#3D9DD8] rounded-xl flex flex-col">
            <legend className="text-lg font-semibold mb-2">
              Issue Details
            </legend>

            <p className="mb-2 font-semibold">
              Issue ID: {selectedIssue.issueId}
            </p>

            <label htmlFor="issueType" className="pb-2">
              Issue Type
            </label>
            <div className="flex flex-row relative w-full items-center justify-between">
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType || ""}
                onChange={handleChange}
                className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
              >
                <option value="">Select an option</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <Arrow />
            </div>

            {(userData.role === "admin" ||
              userData.role === "project manager") && (
              <>
                <label htmlFor="status" className="pb-2">
                  Status
                </label>
                <div className="flex flex-row relative w-full items-center justify-between">
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Arrow />
                </div>
              </>
            )}
          </fieldset>

          {/* Device & Browser */}
          <fieldset className="w-full p-4 border-5 border-[#EBA911] rounded-xl flex flex-col justify-start items-start">
            <legend className="text-lg font-semibold mb-2">
              Device & Browser Info
            </legend>

            <label htmlFor="device" className="pb-2">
              Device
            </label>
            <div className="flex flex-row relative w-full items-center justify-between">
              <select
                id="device"
                name="device"
                value={formData.device || ""}
                onChange={handleChange}
                className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
              >
                <option value="">Select device</option>
                {deviceOptions.map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
              <Arrow />
            </div>

            <label htmlFor="browser" className="pb-2">
              Browser
            </label>
            <input
              id="browser"
              name="browser"
              value={formData.browser || ""}
              onChange={handleChange}
              type="text"
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full"
            />
          </fieldset>

          {/* Additional Info */}
          <fieldset className="w-full p-4 border-5 border-[#7ce55e] rounded-xl flex flex-col justify-start items-start">
            <legend className="text-lg font-semibold mb-2">
              Additional Info
            </legend>

            {userData.role === "client" && (
              <>
                <label htmlFor="clientComment" className="pb-2">
                  Client Comment
                </label>
                <textarea
                  id="clientComment"
                  name="clientComment"
                  value={formData.clientComment || ""}
                  onChange={handleChange}
                  rows={3}
                  className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full resize-none"
                />
              </>
            )}

            {(userData.role === "admin" ||
              userData.role === "project manager") && (
              <>
                <label htmlFor="terraComments" className="pb-2">
                  Terra Comments
                </label>
                <textarea
                  id="terraComments"
                  name="terraComments"
                  value={formData.terraComments || ""}
                  onChange={handleChange}
                  rows={3}
                  className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full resize-none"
                />
              </>
            )}

            <label htmlFor="page" className="pb-2">
              Page URL
            </label>
            <input
              id="page"
              name="page"
              value={formData.page || ""}
              onChange={handleChange}
              type="text"
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full"
            />

            <label htmlFor="screenshot" className="pb-2">
              Screenshot (new)
            </label>
            <input
              id="screenshot"
              name="screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setScreenshotFile(file || null);
              }}
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 w-full cursor-pointer"
            />
          </fieldset>

          <div className="flex flex-col sm:flex-row justify-between w-full my-12 items-center">
            <button
              type="button"
              onClick={() => {
                setSelectedIssue(null);
                setScreenshotFile(null);
              }}
              className=" rounded-[50px] border-3 border-[var(--bg-color)] px-6 py-2 font-semibold text-[var(--bg-color)] hover:rounded-[8px] transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="font-semibold text-xl  px-4 py-2 border-3 border-[#F78BD8] text-[var(--bg-color)] rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out min-w-36"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default EditIssue;
