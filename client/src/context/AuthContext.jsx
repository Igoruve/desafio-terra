import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, logout, getMe } from "../utils/auth";

const AuthContext = createContext({
  userData: null,
  loading: true,
  onLogin: async () => {},
  onLogout: () => {},
  onRegister: async () => {},
});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const result = await getMe();
        console.log("getMe result:", result);
        if (result.user && result.user.role) {
          setUserData(result.user);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Auth verification failed:", error.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleRegister = async (name, email, password) => {
    try {
      const result = await register(name, email, password);
      if (result.error) {
        return result.error;
      }
      navigate("/login");
      return null;
    } catch (error) {
      console.error("Register error:", error);
      return "Error processing the register.";
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const result = await login(email, password);
      if ("error" in result && result.error) {
        return result.error;
      }
      if (result.user && result.user.role) {
        setUserData(result.user);
        navigate("/");
        return null;
      }
      return "Invalid user data";
    } catch (error) {
      console.error("Error logging in:", error);
      return "Error processing the login.";
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setUserData(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        loading,
        onLogin: handleLogin,
        onLogout: handleLogout,
        onRegister: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
