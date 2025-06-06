import { useState } from "react";

import { createIssue } from "../../utils/issue";

import { useLoaderData } from "react-router-dom";

const issueTypes = [
  "Copy revision",
  "Requested Change",
  "New Item",
  "Bug Fix",
  "Design Issues",
  "Not Addressing",
];

const statusOptions = [
  "In Progress",
  "Complete",
  "Post Launch",
  "Needs Inputs",
  "Ready to upload",
  "Duplicate Comment",
  "N/A",
];

const deviceOptions = ["Desktop", "Mobile", "Tablet"];

const topBrowsers = [
  "Google Chrome",
  "Apple Safari",
  "Microsoft Edge",
  "Mozilla Firefox",
];

function Form() {
  const { projectId } = useLoaderData();
  const [expanded, setExpanded] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      issueType: form.issueType.value,
      specifyIssue: form.specifyIssue?.value || "",
      status: form.status.value,
      device: form.device.value,
      browser: form.browser.value,
      clientComment: form.comment.value,
      page: form.url.value,
      image: form.image.files[0] || null,
    };
    const result = await createIssue(projectId, data);
  };

  const handleIssueTypeChange = (e) => {
    setExpanded(e.target.value === "Other");
  };

  return (
    <section className="flex flex-col items-center justify-center h-ful bg-[var(--bg-color)] text-white">
      <form
        onSubmit={handleSubmitForm}
        action=""
        className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto h-full my-24 text-xl"
      >
        <fieldset className="w-full p-4 border-3 border-[#ffb410] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">Issue Details</legend>

          <label htmlFor="issueType" className="pb-4">
            Issue Type*
          </label>
          <select
            id="issueType"
            name="issueType"
            required
            onChange={handleIssueTypeChange}
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer"
          >
            <option value="">Select an option</option>
            {issueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {expanded && (
            <>
              <label htmlFor="" className="pb-4">
                Specify the issue
              </label>
              <textarea
                id="specifyIssue"
                name="specifyIssue"
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 h-fit max-h-60 w-full cursor-pointer "
              ></textarea>
            </>
          )}

          <label htmlFor="status" className="pb-4">
            Status*
          </label>
          <select
            id="status"
            name="status"
            defaultValue="On Hold"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer "
          >
            <option value="On Hold">On Hold</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="w-full p-4 border-3 border-[#7ce55e] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">
            Device & Browser Info
          </legend>

          <label htmlFor="device" className="pb-4">
            Device
          </label>
          <select
            id="device"
            name="device"
            defaultValue="Desktop"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer "
          >
            {deviceOptions.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>

          <label htmlFor="browser" className="pb-4">
            Browser
          </label>
          <select
            id="browser"
            name="browser"
            defaultValue="Google Chrome"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer "
          >
            {topBrowsers.map((browser) => (
              <option key={browser} value={browser}>
                {browser}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </fieldset>

        <fieldset className="w-full p-4 border-3 border-[#3D9DD8] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">
            Additional Info
          </legend>

          <label htmlFor="comment" className="pb-4">
            Comment*
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 h-fit max-h-60 w-full cursor-pointer "
          ></textarea>

          <label htmlFor="url" className="pb-4">
            Page URL*
          </label>
          <textarea
            id="url"
            name="url"
            rows="2"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 max-h-60 w-full resize-none overflow-hidden whitespace-nowrap h-12"
          ></textarea>

          <label htmlFor="image" className="pb-4">
            Screenshot
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer "
          />
        </fieldset>

        <button
          type="submit"
          className="font-semibold text-xl mt-4 px-4 py-2 border-3 border-[#F78BD8] text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default Form;
