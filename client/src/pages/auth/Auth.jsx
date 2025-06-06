import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Icons from "../home/Icons";

function Auth({ isRegister }) {
  const [error, setError] = useState(null);
  const { onLogin, onRegister } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister
      ? await onRegister(userData.name, userData.email, userData.password)
      : await onLogin(userData.email, userData.password);

    if (!result) {
      navigate("/project");
    } else {
      setError(result);
    }
  };

  return (
    <section className="h-full w-screen bg-[var(--bg-color)] text-white font-uncut flex flex-col justify-center items-center pb-12">
      <div className="w-full">
        <Icons />
      </div>

      <div className="flex flex-col items-center justify-center h-full pt-12">
        <h2 className="text-6xl font-black mb-8">
          {isRegister ? "Register" : "Log In"}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-transparent p-6 rounded-lg border-2 border-white/50 w-full max-w-md"
        >
          <div className="flex flex-col gap-6">
            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold" htmlFor="name">
                  Username:
                </label>
                <input
                  className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
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
              <label className="text-lg font-bold" htmlFor="email">
                Email:
              </label>
              <input
                className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold" htmlFor="password">
                Password:
              </label>
              <input
                className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
                type="password"
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-32 self-center text-white py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] bg-transparent font-bold text-lg mt-8 transition-all duration-300 ease-in-out"
          >
            {isRegister ? "Register" : "Log In"}
          </button>
        </form>

        <div className="flex flex-col items-center mt-6 gap-2">
          {isRegister ? (
            <>
              <p className="text-lg font-light">Already have an account?</p>
              <Link to="/login">
                <button className="w-32 text-white py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] w-40 bg-transparent font-bold text-lg transition-all duration-300 ease-in-out">
                  Go to Log In
                </button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg font-light">Don't have an account?</p>
              <Link to="/register">
                <button className="w-32 text-[#0f0f0f] py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] bg-white font-bold text-lg transition-all duration-300 ease-in-out">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Auth;
