import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  saveToken,
  removeToken,
  saveToLocalStorage,
  getFromLocalStorage,
} from "../utils/localStorage";

import { login, register, logout } from "../utils/auth";

const AuthContext = createContext({
  userData: null,
  onLogin: async () => {},
  onLogout: () => {},
  onRegister: async () => {},
});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  //cargar los datos del usuario al inicio si existe
  useEffect(() => {
    
    const savedUserData = getFromLocalStorage("userData");
    if (savedUserData) {
      setUserData(savedUserData);
    }
  }, []);

  const handleRegister = async (name, email, password) => {
    try {
      const result = await register(name, email, password);

      if (result.error) {
        return result.error;
      } else {
        if (result.token) {
          //si existe token, lo guarda
          saveToken(result.token);
        }
        if (result.user) {
          //y si existe user guarda sus datos
          setUserData(result.user);
        }

        navigate(`/login`);
        return null;
      }
    } catch (error) {
      console.error("Register error: ", error);
      return "Error processing the register.";
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const result = await login(email, password);
      if ("error" in result && result.error) {
        removeToken();
        return result.error;
      } else {
        if (result.token) {
          //si existe token, lo guarda
          saveToken(result.token);
        }
        let finalUserData = result.user;
        setUserData(finalUserData);
        navigate("/projects"); //TODO: redirigir a la homepage?
        return null;
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      return "Error processing the login.";
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error loggint out: ", error);
    } finally {
      //siempre limpia los datos locales independientemente de la respuesta del servidor
      removeToken();
      localStorage.removeItem("userData");
      setUserData(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData: userData,
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
