import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  /* saveToken,
  removeToken, */
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
         // NO guardar token (no viene en respuesta o no usamos)
        /* if (result.token) {
          //si existe token, lo guarda
          saveToken(result.token); */
          if (result.user) {
          setUserData(result.user);
          saveToLocalStorage("userData", result.user);
        }
        navigate(`/login`); //tras registro, ir a login para iniciar sesion
        return null;
      }
    } catch (error) {
      console.error("Error registering: ", error);
      return "Error processing the register.";
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const result = await login(email, password);

      if ("error" in result && result.error) {
        return result.error;
      } else {
        // Solo guardar usuario, NO token
        /* if (result.token) {
          //si existe token, lo guarda
          saveToken(result.token);
        } */
        let finalUserData = result.user;
        setUserData(finalUserData);
        /* saveToLocalStorage("userData", finalUserData); */
        navigate("/"); //TODO: redirigir a la homepage?
        return null;
      }
    } catch (error) {
      console.error("Error logging in: ", error);
      return "Error processing the login.";
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); //Limpia cookie en backend
    } catch (error) {
      console.error("Error loggint out: ", error);
    } finally {
      //siempre limpia los datos locales independientemente de la respuesta del servidor
      //Siempre limpiar usuario local y localStorage
      /* removeToken(); */
      localStorage.removeItem("userData");
      setUserData(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        /* userData:  */userData,
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
