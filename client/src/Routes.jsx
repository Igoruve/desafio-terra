import { createBrowserRouter } from "react-router-dom";

import ProjectList from "./components/project/ProjectList.jsx";
import Project from "./components/project/Project.jsx";

import { getProjectsByUserId, getProjectById } from "./utils/project.js";

import { createIssue } from "./utils/issue.js";

import Auth from "./pages/auth/Auth.jsx";
import Root from "./pages/root/Root.jsx";
import Homepage from "./pages/home/Homepage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProjectsByUser from "./components/project/ProjectsByUser.jsx";
import AllProjectsByUser from "./components/project/AllProjectsByUser.jsx";
import Form from "./components/form/Form.jsx";
import Profile from "./components/profile/Profile.jsx";

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
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/project",
            element: <AllProjectsByUser />,
          },
          {
            path: "/project/:id",
            element: <Project />,
            loader: async ({ params }) => getProjectById(params.id),
          },
          {
            path: "/issue/create/:projectId",
            element: <Form />,
            loader: async ({ params }) => {
              return { projectId: params.projectId };
            },
          },
        ],
      },
    ],
  },
]);

export default router;
