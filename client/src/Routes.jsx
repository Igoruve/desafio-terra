import { createBrowserRouter } from "react-router-dom";

import Auth from "./pages/auth/Auth.jsx";
import Root from "./pages/root/Root.jsx";

const router = createBrowserRouter([
  {
    path: "/",  
    element: <Root />,
    children: [
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
