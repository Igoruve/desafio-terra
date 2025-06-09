import { createBrowserRouter } from "react-router-dom";

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
import EditProject from "./components/editProject/EditProject.jsx"; 
import EditIssue from "./components/editIssue/EditIssue.jsx";

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
        element: <Layout />,
        children: [
          {
            path: "/myprojects",
            element: <ProjectsByUser />,
          },
          {
            path: "/project/edit",
            element: <EditProject />,
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
            path: "/issues/edit",
            element: <EditIssue />,
          },
          {
            path: "/issue/create/:projectId",
            element: <Form />,
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
