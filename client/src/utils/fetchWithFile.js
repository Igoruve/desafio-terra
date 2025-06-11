
const BASE_URL = import.meta.env.VITE_BACKEND_URL_PROD;

async function FetchWithFile(route, method = "GET", data = null) {
  const url = BASE_URL + route;
  console.log("Fetching URL:", url);

  const options = {
    method,
    headers: {},
    credentials: "include",
  };

  /* const token = localStorage.getItem("token");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  } */

  if (data) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);
    console.log("Response:", response);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        console.error("Non-JSON error response:", errorText);
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error("Expected JSON but got:", text);
      throw new Error("Response is not JSON");
    }
  } catch (error) {
    console.error("FetchWithFile error:", error);
    return { error: true, message: error.message };
/*******  0e164bae-6e96-4977-b8c6-4133d251e6f9  *******/
  }
}

export default FetchWithFile;