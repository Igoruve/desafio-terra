import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Icons from "../home/Icons";
import { Eye, EyeOff } from "lucide-react";

function Auth({ isRegister }) {
  const [error, setError] = useState(null);
  const { onLogin, onRegister } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && userData.password !== userData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const result = isRegister
      ? await onRegister(userData.name, userData.email, userData.password)
      : await onLogin(userData.email, userData.password);

      if (result) {
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

            <div className="flex flex-col gap-2 relative">
              <label className="text-lg font-bold" htmlFor="password">
                Password:
              </label>
              <input
                className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
              />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[44px] text-white opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>

            {isRegister && (
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold" htmlFor="confirmPassword">
                  Repeat Password:
                </label>
                <input
                  className="bg-transparent border-2 border-white/50 rounded-[8px] text-white px-4 py-2 focus:outline-none focus:border-white transition-all duration-300"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[44px] text-white opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-32 self-center py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] font-bold text-lg mt-8 transition-all duration-300 ease-in-out ${
              isRegister ? "bg-white text-black" : "bg-transparent text-white"
            }`}
          >
            {isRegister ? "Register" : "Log In"}
          </button>
        </form>

        {!isRegister && (
          <div className="mt-4 w-full max-w-md flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <div className="flex flex-col items-center mt-6 gap-2">
          {isRegister ? (
            <>
              <p className="text-lg font-light">Already have an account?</p>
              <Link to="/login">
                <button className=" text-white py-2 px-4 border-2 border-white rounded-[50px] cursor-pointer hover:rounded-[8px] w-40 bg-transparent font-bold text-lg transition-all duration-300 ease-in-out">
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
