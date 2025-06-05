import { createBrowserRouter } from "react-router-dom";

import Auth from "./pages/auth/Auth.jsx";
import Root from "./pages/root/Root.jsx";
import Homepage from "./pages/home/Homepage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Auth isRegister={false} />,
      },
      {
        path: "/register",
        element: <Auth isRegister={true} />,
      },
    ],
  },
]);

export default router;
