import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, logout, getMe } from "../utils/auth";

/* import {
  /* saveToken,
  removeToken, 
  saveToLocalStorage,
  getFromLocalStorage,
} from "../utils/localStorage"; */

const AuthContext = createContext({
  userData: null,
  onLogin: async () => {},
  onLogout: () => {},
  onRegister: async () => {},
});

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

   // Al cargar, pedir datos al backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getMe();
        if (result?.user) {
          setUserData(result.user);
        }
      } catch (err) {
        console.error("Not logged in or session expired.");
      }
    };
    fetchUser();
  }, []);

  const handleRegister = async (name, email, password) => {
    try {
      const result = await register(name, email, password);

      if (result.error) {
        return result.error;
      } else {
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

      if (result.error) {
        return result.error;
      } 
      
      //Pedimos al backend los datos del usuario autenticado
      const me = await getMe();
      if (me?.user) {
        setUserData(me.user);
        navigate("/");
        return null;
      }else {
       return "Login successful, but failed to fetch user data.";
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
      setUserData(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
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
