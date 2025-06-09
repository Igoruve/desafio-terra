import { useNavigate, useLoaderData } from "react-router-dom";
import { createProject } from "../../utils/project.js";
import Arrow from "../createIssueForm/Arrow.jsx";

const statusOptions = ["In Progress", "Complete", "Cancelled"];

function CreateProjectForm() {
  const navigate = useNavigate();

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const form = e.target;

    function isValidMongoId(id) {
      return /^[a-fA-F0-9]{24}$/.test(id);
    }

    const rawClients = form.clients.value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    const invalidClientIds = rawClients.filter((id) => !isValidMongoId(id));
    const managerId = form.manager.value.trim();

    if (!isValidMongoId(managerId)) {
      alert("Invalid MongoDB ID for Manager.");
      return;
    }

    if (invalidClientIds.length > 0) {
      alert("Invalid Client IDs: " + invalidClientIds.join(", "));
      return;
    }

    const data = {
      title: form.title.value,
      description: form.description.value,
      status: form.status.value,
      manager: managerId,
      clients: rawClients,
      issues: [],
    };

    const result = await createProject(data);
    navigate(`/projects`); // TODO: cambiar ruta si hace falta
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-color)] text-white pt-24 relative overflow-hidden">
      <h2 className="hidden sm:block text-6xl font-bold fixed top-24 left-24 w-72">
        Create a new Project!
      </h2>

      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col gap-4 items-center justify-center w-full max-w-md mx-auto my-8 px-4 text-base sm:text-xl"
      >
        <fieldset className="w-full px-8 py-4 border-3 border-[#3D9DD8] rounded-xl flex flex-col">
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
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 w-full"
          />

          <label htmlFor="description" className="pb-2">
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 w-full"
          ></textarea>

          <label htmlFor="status" className="pb-2">
            Status*
          </label>
          <div className="flex flex-row relative w-full items-center justify-between">
            <select
              id="status"
              name="status"
              defaultValue="In Progress"
              required
              className="appearance-none pr-10 bg-[var(--bg-color)] border-3 border-white rounded-[50px] px-4 py-2 mb-4 cursor-pointer w-full"
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

        <fieldset className="w-full p-4 border-3 border-[#EBA911] rounded-xl flex flex-col justify-start items-start">
          <legend className="text-lg font-semibold mb-2">Project Access</legend>

          <label htmlFor="manager" className="pb-2">
            Manager ID*
          </label>
          <input
            id="manager"
            name="manager"
            type="text"
            required
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 w-full cursor-text"
          />

          <label htmlFor="clients" className="pb-2">
            Client IDs*
          </label>
          <textarea
            id="clients"
            name="clients"
            placeholder="(comma-separated)"
            className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 mb-4 w-full cursor-text h-24"
          ></textarea>
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

export default CreateProjectForm;
