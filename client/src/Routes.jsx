import { createBrowserRouter } from "react-router-dom";

import ProjectList from "./components/project/ProjectList.jsx";
import Project from "./components/project/Project.jsx";

import { getProjectsByUserId, getProjectById } from "./utils/project.js";

import { createIssue } from "./utils/issue.js";

import Auth from "./pages/auth/Auth.jsx";
import Root from "./pages/root/Root.jsx";
import Homepage from "./pages/home/Homepage.jsx";
import Layout from "./components/layout/Layout.jsx";
import Form from "./components/form/Form.jsx";

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
            path: "/project/user/:id",
            element: <ProjectList />,
            loader: async ({ params }) => getProjectsByUserId(params.id),
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
