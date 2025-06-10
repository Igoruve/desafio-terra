import { useParams } from "react-router-dom";
import { useState } from "react";
import Icons from "../home/Icons.jsx"; // Asegúrate de importar el componente Icons como en RecoveryPassword

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL_PROD}/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset successful.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else {
      setMessage(data.error || "Error resetting password.");
    }
  };

  return (
    <section className="min-h-screen w-screen bg-[var(--bg-color)] text-white font-uncut flex flex-col justify-center items-center pb-12">
      <div className="w-full">
        <Icons />
      </div>
      <div className="flex flex-col items-center justify-center h-full pt-12">
        <h2 className="text-3xl font-black mb-8">Reset your password</h2>
        <form
          className="flex flex-col bg-transparent p-6 rounded-lg border-2 border-white/50 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <input
            className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            className="w-48 mt-8 text-[#0f0f0f] py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] bg-white font-bold text-lg transition-all duration-300 ease-in-out self-center"
            type="submit"
          >
            Update Password
          </button>
        </form>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </section>
  );
}

export default ResetPassword;
