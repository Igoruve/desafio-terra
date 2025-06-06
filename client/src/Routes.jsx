import { createBrowserRouter } from "react-router-dom";

import ProjectList from "./components/project/ProjectList.jsx";
import Project from "./components/project/Project.jsx";

import { getProjectsByUserId, getProjectById} from "./utils/project.js";

import Auth from "./pages/auth/Auth.jsx";
import Root from "./pages/root/Root.jsx";
import Homepage from "./pages/home/Homepage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProjectsByUser from "./components/project/AllProjectsByUser.jsx";
import AllProjectsByUser from "./components/project/AllProjectsByUser.jsx";

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
        path: "login",
        element: <Auth isRegister={false} />,
      },
      {
        path: "register",
        element: <Auth isRegister={true} />,
      },
      {
        path: "logout",
        element: <Homepage />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: "/myprojects",
            element: <ProjectsByUser />,
          },
          {
            path: "/project",
            element: <AllProjectsByUser />,
          },
          {
            path: "/project/:id",
            element: <Project />,
            loader: async ({ params}) => getProjectById(params.id),
          },
        ],
      },
    ],
  },
]);

export default router;
