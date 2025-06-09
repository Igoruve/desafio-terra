import { useParams } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_PROD}/reset-password/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword }),
        });

        const data = await res.json();

        if (res.ok) setMessage("Password reset successful");
        else setMessage(data.error || "Error resetting password");

        setTimeout(() => {
            window.location.href = "/login";
        })
    };

    return (
        <div>
            <h2>Reset Password </h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Update Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ResetPassword;