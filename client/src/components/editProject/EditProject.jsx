import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchWithFile from "../../utils/fetchWithFile";

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
  const { userData, loading: authLoading } = useContext(AuthContext);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [formData, setFormData] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
/*         if (authLoading) return;
 */        if (!userData?.userId || !userData?.role) {
          setError("You must be logged in");
          setLoading(false);
          return;
        }

        let endpoint = "";
        if (userData.role === "admin") {
          endpoint = "/issue/";
        } else if (
          userData.role === "project manager" ||
          userData.role === "client"
        ) {
          endpoint = `/issue/user/${userData.userId}`;
        } else {
          setError("Unauthorized access");
          setLoading(false);
          return;
        }

        const data = await FetchWithFile(endpoint);

        if (data.error) {
          throw new Error(data.message || "Failed to fetch issues");
        }

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }

        setIssues(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [userData, authLoading]);

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
    const { name, value, files } = e.target;
    if (name === "screenshot") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!selectedIssue) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      let dataToSend;

      if (formData.screenshot && typeof formData.screenshot !== "string") {
        dataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "screenshot" && value instanceof File) {
            dataToSend.append(key, value);
          } else if (value !== undefined && value !== null) {
            dataToSend.append(key, value);
          }
        });
      } else {
        dataToSend = { ...formData };
      }

      const data = await FetchWithFile(
        `/issue/${selectedIssue.issueId}/edit`,
        "PUT",
        dataToSend
      );

      if (!data) throw new Error("No data returned from server");
      if (data.error) throw new Error(data.message || "Update failed");

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

  if (authLoading || loading) {
    return <div className="text-white p-4">Loading issues...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

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
        {issues.length === 0 && <li>No issues found.</li>}
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
          <label>
            Issue Type:
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              onFocus={() => handleFocus("issueType")}
              onBlur={() => handleBlur("issueType")}
              className="w-full p-2 rounded"
              required
            >
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              onFocus={() => handleFocus("status")}
              onBlur={() => handleBlur("status")}
              className="w-full p-2 rounded"
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Device:
            <select
              name="device"
              value={formData.device}
              onChange={handleChange}
              onFocus={() => handleFocus("device")}
              onBlur={() => handleBlur("device")}
              className="w-full p-2 rounded"
              required
            >
              {deviceOptions.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </label>

          <label>
            Browser:
            <input
              type="text"
              name="browser"
              value={formData.browser}
              onChange={handleChange}
              onFocus={() => handleFocus("browser")}
              onBlur={() => handleBlur("browser")}
              className="w-full p-2 rounded"
            />
          </label>

          <label>
            Client Comment:
            <textarea
              name="clientComment"
              value={formData.clientComment}
              onChange={handleChange}
              onFocus={() => handleFocus("clientComment")}
              onBlur={() => handleBlur("clientComment")}
              className="w-full p-2 rounded"
              rows={3}
            />
          </label>

          <label>
            Page:
            <input
              type="text"
              name="page"
              value={formData.page}
              onChange={handleChange}
              onFocus={() => handleFocus("page")}
              onBlur={() => handleBlur("page")}
              className="w-full p-2 rounded"
            />
          </label>

          <label>
            Terra Comments:
            <textarea
              name="terraComments"
              value={formData.terraComments}
              onChange={handleChange}
              onFocus={() => handleFocus("terraComments")}
              onBlur={() => handleBlur("terraComments")}
              className="w-full p-2 rounded"
              rows={3}
            />
          </label>

          <label>
            Screenshot:
            <input
              type="file"
              name="screenshot"
              onChange={handleChange}
              accept="image/*"
              className="w-full p-2 rounded"
            />
            {formData.screenshot && typeof formData.screenshot === "string" && (
              <img
                src={formData.screenshot}
                alt="Current Screenshot"
                className="mt-2 max-h-48 rounded"
              />
            )}
          </label>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              disabled={saving}
              className="font-semibold text-lg px-4 py-2 border-3 border-[#7ce55e] text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIssue(null)}
              className="font-semibold text-lg px-4 py-2 border-3 border-[#3D9DD8] text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default EditIssue;
