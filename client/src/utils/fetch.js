import { getToken } from "./localStorage";

// const BASE_URL = "http://localhost:3013";

const BASE_URL = import.meta.env.VITE_BACKEND_URL_PROD;

async function FetchData(route, method = "GET", data = null) {
  const url = BASE_URL + route;
  const token = getToken();
  console.log("token", token);
  const options = {
    method,
    headers: {},
    credentials: "include",
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    console.log("response", response);
    const contentType = response.headers.get("content-type");

    let responseData;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text(); // para debug
      console.error("Expected JSON but got:", text);
      throw new Error("Response is not JSON");
    }

    if (!response.ok) {
      responseData.status = response.status;
    }

    return responseData;
  } catch (error) {
    console.error("Fetch error", error);
    return { error: true, message: error.message };
  }
}

export default FetchData;
