import FetchData from "./fetch.js";
/* import { saveToken, saveUser } from "../utils/localStorage.js"; */

async function login(email, password) {
  if (!email) return { error: "Not valid email" };
  if (!password) return { error: "Please introduce the password" };

  const data = { email, password };
  const result = await FetchData("/login", "POST", data);

  if (!result.error) {
    /* saveToken(result.token); */
    saveUser(result.user);
  }

  return result;
}

async function register(name, email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  // Control de errores
  if (!email || !emailRegex.test(email)) {
    return { error: "Not valid email" };
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return { error: "Please introduce the password" };
  }

  const data = {
    email,
    password,
    name,
  };

  const result = await FetchData("/register", "POST", data);

  if (result.error) {
    console.error("Register error", result);
  } else {
    console.log("You have been registered", {
      usuario: result.user?.name || "desconocido",
    });
  }

  return result;
}

async function logout() {
  const result = await FetchData("/logout", "POST");
  if (!result.error) {
    // Limpiar localStorage o estado donde guardas info del usuario
    localStorage.removeItem("user");
    // Si tienes algún estado global, actualizarlo para reflejar logout
  }
  return result;
}

export { login, register, logout };
