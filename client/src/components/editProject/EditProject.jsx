import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditProjectAdmin from "./EditProjectAdmin.jsx";
import EditProjectPM from "./EditProjectPM.jsx";

const EditProject = () => {
  const { userData } = useContext(AuthContext);
  const isAdmin = userData?.role === "admin";
  const isManager = userData?.role === "project manager";

  

  if (!userData) {
    return (
      <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
        <p className="text-red-500 text-lg">You must be logged in to access this page.</p>
      </section>
    );
  }

  if (isAdmin) {
    return <EditProjectAdmin />;
  }

  if (isManager) {
    return <EditProjectPM />;
  }

  return (
    <section className="flex flex-col items-center justify-center bg-[var(--bg-color)] text-white pt-20 px-4 min-h-screen">
      <p className="text-red-500 text-lg">You do not have permission to access this page.</p>
    </section>
  );
};

export default EditProject;