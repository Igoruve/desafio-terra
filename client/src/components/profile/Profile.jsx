import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FetchData from "../../utils/fetch";

const Profile = () => {
  const { userData } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?._id) return;
      setLoading(true);
      try {
        const result = await FetchData(`/user/${userData._id}`);
        if (result.error) {
          setMessage({ type: "error", text: result.message || "Error loading profile" });
        } else {
          setProfile(result);
          setFormData({
            name: result.name || "",
            email: result.email || "",
            password: "",
          });
        }
      } catch {
        setMessage({ type: "error", text: "Failed to fetch profile" });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (field) => {
    if (!touchedFields[field]) {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field) => {
    if (!formData[field]) {
      setFormData((prev) => ({
        ...prev,
        [field]: profile?.[field] || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;

    try {
      const result = await FetchData(`/user/${userData._id}`, "PUT", dataToSend);
      if (result.error) {
        setMessage({ type: "error", text: result.message });
      } else {
        setProfile(result);
        setEditing(false);
        setShowPasswordField(false);
        setTouchedFields({});
        setMessage({ type: "success", text: "Profile updated successfully" });
      }
    } catch {
      setMessage({ type: "error", text: "Error updating profile" });
    }
  };

  if (loading) return <div className="text-white p-4">Loading profile...</div>;

  return (
    <section className="py-18">
      <header className="bg-[var(--bg-color)] text-white py-4 grid grid-cols-1 custom-xl:grid-cols-3">
        <h2 className="text-[64px] sm:text-[96px] md:text-[140px] lg:text-[180px] xl:text-[220px] 2xl:text-[250px] font-bold mb-4 leading-[0.75] custom-xl:col-span-2 max-w-[12ch] break-words">
          my
          <br />
          profile
        </h2>
        <div className="flex justify-end items-start pt-12 font-bold custom-xl:items-end pr-8">
          <p className="text-2xl">Edit your profile</p>
        </div>
      </header>

      {message && (
        <div className={`mb-4 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-lg border-3 border-[#F78BD8] rounded-xl p-6"
      >
        {!editing ? (
          <>
            <p><strong>Name:</strong> {profile?.name}</p>
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
            <button
              type="button" onClick={() => {
                setEditing(true);
                setMessage(null);
              }}
              className="font-semibold text-lg px-4 py-2 border-3 border-white text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                onChange={handleChange}
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                onChange={handleChange}
                className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                required
              />
            </div>

            {!showPasswordField ? (
              <button
                type="button"
                onClick={() => setShowPasswordField(true)}
                className="text-sm text-[#ffb410] underline mt-2"
              >
                Change password
              </button>
            ) : (
              <div className="flex flex-col">
                <label htmlFor="password" className="mb-1">New password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password"
                  onFocus={() => {
                    if (!touchedFields.password) {
                      setFormData(prev => ({ ...prev, password: "" }));
                      setTouchedFields(prev => ({ ...prev, password: true }));
                    }
                  }}
                  className="appearance-none bg-[var(--bg-color)] border-3 border-white rounded-[20px] px-4 py-2 text-white"
                />
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="font-semibold text-lg px-4 py-2 border-3 border-[#7ce55e] text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setShowPasswordField(false);
                  setFormData({
                    name: profile?.name || "",
                    email: profile?.email || "",
                    password: "",
                  });
                  setTouchedFields({});
                }}
                className="font-semibold text-lg px-4 py-2 border-3 border-[#3D9DD8] text-white rounded-[50px] cursor-pointer hover:rounded-[8px] transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );

};

export default Profile;
