function saveToLocalStorage(key, value) {
  if (value !== null && value !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.removeItem(key);
  }
}

function getFromLocalStorage(token, defaultValue = null) {
  const result = localStorage.getItem(token);
  console.log("result", result);
  if (result) {
    try {
      return JSON.parse(result); //intentamos parsear el resultado
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
      localStorage.removeItem(token); // eliminamos el item si no se puede parsear
      return defaultValue;
    }
  } else {
    return defaultValue;
  }
}

function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function saveToken(token) {
  if (token) {
    saveToLocalStorage("token", token);
  }
}

function getToken() {
  return getFromLocalStorage("token");
}

function removeToken() {
  removeFromLocalStorage("token");
}

function saveUser(user) {
  saveToLocalStorage("user", user);
}

function getUser() {
  return getFromLocalStorage("user", null);
}

function removeUser() {
  removeFromLocalStorage("user");
}

export {
  saveToLocalStorage,
  getFromLocalStorage,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
};
