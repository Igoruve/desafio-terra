import { useNavigate } from "react-router-dom";
import { createProject } from "../../utils/project.js";
import Arrow from "../createIssueForm/Arrow.jsx";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";

const statusOptions = ["In Progress", "Complete", "Cancelled"];

function CreateProjectForm() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.target;

    const rawClients = form.clientsNames.value
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    const data = {
      title: form.title.value,
      description: form.description.value,
      status: form.status.value,
      manager: userData.userId,
      clientsNames: rawClients,
      issues: [],
    };

    const result = await createProject(data);

    if (result.error || result.message === "Client Not Found") {
      setError(result.message || "Something went wrong");
    } else {
      navigate(`/projects`);
    }
  };

  return (
    <section className="flex flex-col bg-white pt-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          new
          <br />
          project
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Create a new project!</p>
        </div>
      </header>

      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto my-8 px-4 text-base sm:text-xl"
      >
        <fieldset className="w-full px-8 py-4 border-5 border-[#3D9DD8] rounded-xl flex flex-col">
          <legend className="text-lg font-semibold mb-2">
            Project Details
          </legend>

          <label htmlFor="title" className="pb-2">
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 w-full"
          />
          <p className="text-right text-sm text-gray-400 mb-3">
            {title.length}/80
          </p>

          <label htmlFor="description" className="pb-2">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full"
          ></textarea>
          <p className="text-right text-sm text-gray-400 mb-3">
            {description.length}/500
          </p>

          <label htmlFor="status" className="pb-2">
            Status*
          </label>
          <div className="flex flex-row relative w-full items-center justify-between">
            <select
              id="status"
              name="status"
              defaultValue="In Progress"
              required
              className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full pr-10"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Arrow />
          </div>
        </fieldset>

        <fieldset className="w-full p-4 border-5 border-[#EBA911] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">Project Access</legend>
          <label htmlFor="clientsNames" className="pb-2">
            Client Name(s)*
          </label>
          <textarea
            id="clientsNames"
            name="clientsNames"
            placeholder="(comma-separated)"
            className="appearance-none bg-white text-[var(--bg-color)] border-3 border-[var(--bg-color)] rounded-[20px] px-4 py-2 mb-4 w-full cursor-text h-24"
          ></textarea>
          {error && <p className="text-red-500">{error}</p>}
        </fieldset>

        <button
          type="submit"
          className="font-semibold text-xl mt-4 px-4 py-2 border-3 border-[#F78BD8] text-[var(--bg-color)]  rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </section>
  );
}

export default CreateProjectForm;
