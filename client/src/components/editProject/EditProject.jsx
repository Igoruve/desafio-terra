import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditProjectAdmin from "./EditProjectAdmin.jsx";
import EditProjectPM from "./EditProjectPM.jsx";

const EditProject = () => {
  const { userData } = useContext(AuthContext);

  if (!userData) {
    return (
      <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
        <p className="text-red-500 text-lg">
          You must be logged in to access this page.
        </p>
      </section>
    );
  }

  return (
    <section className="py-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          edit
          <br />
          projects
        </h2>
      </header>
      <main>
        {userData.role === "admin" && <EditProjectAdmin />}
        {userData.role === "project manager" && <EditProjectPM />}
      </main>
    </section>
  );
};

export default EditProject;
