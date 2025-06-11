import { useState, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext.jsx";
import { createIssue } from "../../utils/issue.js";
import Arrow from "./Arrow.jsx";

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
  "In Progress",
  "Complete",
  "Post Launch",
  "Needs Inputs",
  "Ready to upload",
  "Duplicate Comment",
  "Other",
];

const deviceOptions = ["Desktop", "Mobile", "Tablet"];

const topBrowsers = [
  "Google Chrome",
  "Apple Safari",
  "Microsoft Edge",
  "Mozilla Firefox",
];

function CreateIssueForm() {
  const { projectId } = useLoaderData();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const { userData } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData();
    formData.append("issueType", form.issueType.value);
    formData.append("specifyIssue", form.specifyIssue?.value || "");
    if (userData.role !== "client") {
      formData.append("status", form.status.value);
    }
    formData.append("device", form.device.value);
    formData.append("browser", form.browser.value);
    formData.append("clientComment", form.comment.value);
    formData.append("page", form.url.value);

    if (screenshotFile) {
      formData.append("screenshot", screenshotFile);
    }

    const result = await createIssue(projectId, formData);
    navigate(`/projects`);
  };

  // const handleIssueTypeChange = (e) => {
  //   setExpanded(e.target.value === "Other");
  // };

  return (
    <section className="flex flex-col bg-white pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          new
          <br />
          issue
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Create a new issue!</p>
        </div>
      </header>

      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto my-8 px-4 text-base sm:text-xl"
      >
        {/* Issue Details */}
        <fieldset className="w-full px-8 py-4 border-5 border-[#3D9DD8] rounded-xl flex flex-col">
          <legend className="text-lg font-semibold mb-2">Issue Details</legend>

          <label htmlFor="issueType" className="pb-2">
            Issue Type*
          </label>
          <div className="flex flex-row relative w-full items-center justify-between">
            <select
              id="issueType"
              name="issueType"
              required
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

          {userData.role !== "client" && (
            <>
              <label htmlFor="status" className="pb-2">
                Status*
              </label>
              <div className="flex flex-row relative w-full items-center justify-between">
                <select
                  id="status"
                  name="status"
                  defaultValue="On Hold"
                  required
                  className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
                >
                  <option value="On Hold">On Hold</option>
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
              defaultValue="Desktop"
              required
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
            >
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
          <div className="flex flex-row relative w-full items-center justify-between">
            <select
              id="browser"
              name="browser"
              defaultValue="Google Chrome"
              required
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
            >
              {topBrowsers.map((browser) => (
                <option key={browser} value={browser}>
                  {browser}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            <Arrow />
          </div>
        </fieldset>

        {/* Additional Info */}
        <fieldset className="w-full p-4 border-5 border-[#7ce55e] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">
            Additional Info
          </legend>

          <label htmlFor="comment" className="pb-2">
            Comment*
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            maxLength={500}
            onChange={(e) => setComment(e.target.value)}
            required
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full"
          ></textarea>
          <p className="text-right text-sm text-gray-400 mb-3">
            {comment.length}/500
          </p>

          <label htmlFor="url" className="pb-2">
            Page URL*
          </label>
          <input
            type="text"
            id="url"
            name="url"
            required
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full"
          />

          <label htmlFor="screenshot" className="pb-2">
            Screenshot
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setScreenshotFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 w-full cursor-pointer"
          />

          {preview && (
            <div className="w-full flex flex-col items-end gap-2 mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-contain border-2 border-[var(--bg-color)] rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setScreenshotFile(null);
                  setPreview(null);
                }}
                className="text-red-400 hover:underline text-sm cursor-pointer"
              >
                Remove screenshot
              </button>
            </div>
          )}
        </fieldset>

        <button
          type="submit"
          className="font-semibold text-xl mt-4 px-4 py-2 border-3 border-[#F78BD8] text-[var(--bg-color)] rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default CreateIssueForm;
