import { createBrowserRouter } from "react-router-dom";

import { getProjectsByUserId, getProjectById } from "./utils/project.js";

import { createIssue } from "./utils/issue.js";

import Auth from "./pages/auth/Auth.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import RecoveryPassword from "./pages/auth/RecoveryPassword.jsx";
import Root from "./pages/root/Root.jsx";
import Homepage from "./pages/home/Homepage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProjectsByUser from "./components/project/ProjectsByUser.jsx";
import AllProjectsByUser from "./components/project/AllProjectsByUser.jsx";
import CreateIssueForm from "./components/createIssueForm/CreateIssueForm.jsx";
import CreateProjectForm from "./components/createProjectForm/CreateProjectForm.jsx";
import FAQ from "./components/FAQ/FAQ.jsx";
import IssueById from "./components/issue/IssueById.jsx";

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
        path: "forgot-password",
        element: <RecoveryPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: "/newissue/:projectId",
            element: <CreateIssueForm />,
            loader: async ({ params }) => {
              return { projectId: params.projectId };
            },
          },
          {
            path: "/newproject",
            element: <CreateProjectForm />,
          },
          {
            path: "/projects",
            element: <ProjectsByUser />,
/*             loader: getProjectsByUserId => {
              return { getProjectsByUserId };
            }, */
          },
          {
            path: "/issue/:issueId",
            element: <IssueById />,
            loader: async ({ params }) => {
              return { issueId: params.issueId };
            },
          },
          {
            path: "/faq",
            element: <FAQ />,
          },
        ],
      },
    ],
  },
]);

export default router;
