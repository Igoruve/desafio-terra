import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Auth({ isRegister }) {
  const [error, setError] = useState(null);
  const { onLogin, onRegister } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister
      ? await onRegister(userData.name, userData.email, userData.password)
      : await onLogin(userData.email, userData.password);
    console.log(userData);
    setError(result);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <h2 className="text-4xl font-bold text-white pt-38 pb-8">
        {isRegister ? "Register" : "Log in"}
      </h2>
      {error && <p className="text-red-500">{error}</p>}

      <section className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-gray-900 p-4 rounded-lg border border-gray-500/50 shadow-lg h-fit justify-around w-84 items-center"
        >
          <div className="flex flex-col gap-4">
            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="text-white" htmlFor="name">
                  Username:
                </label>
                <input
                  className="bg-gray-800 border border-white/50 rounded-sm text-white px-2 py-2"
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="email">
                Email:
              </label>
              <input
                className="bg-gray-800 border border-white/50 rounded-sm text-white px-2 py-2"
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="password">
                Password:
              </label>
              <input
                className="bg-gray-800 border border-white/50 rounded-sm text-white px-2 py-2"
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-fit self-center font-bold px-6 py-2 rounded-lg bg-gradient-to-r from-[#f56b79] via-[#f78a6b] to-[#fcab51] mt-10 hover:opacity-90 shadow-lg text-white cursor-pointer"
            >
              {isRegister ? "Register" : "Log in"}
            </button>
          </div>
        </form>

        {isRegister ? (
          <>
            <p className="mt-4 text-white">Already have an account?</p>
            <Link to="/login">
              <button className="underline text-[#f56b79] cursor-pointer">
                Go to Log In
              </button>
            </Link>
          </>
        ) : (
          <>
            <p className="mt-4 text-white">Don't have an account?</p>
            <Link to="/register">
              <button className="underline text-[#f56b79] cursor-pointer">
                Register
              </button>
            </Link>
          </>
        )}
      </section>
    </section>
  );
}

export default Auth;
