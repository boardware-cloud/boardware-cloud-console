import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Root from "./pages";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Uptime from "./pages/Dashboard/Uptime";
import Create from "./pages/Dashboard/Uptime/Create";
import Edit from "./pages/Dashboard/Uptime/Edit";
import MonitorDetail from "./pages/Dashboard/Uptime/Monitors/Detail.tsx";
import Account from "./pages/Dashboard/Account";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Totp from "./pages/Dashboard/Account/totp";
import Security from "./pages/Dashboard/Account/Security";
import Admin from "./pages/Dashboard/Admin";
import Detail from "./pages/Dashboard/Admin/Accounts/Detail";
import CreateAccount from "./pages/Dashboard/Admin/Accounts/Create";
import accountApi from "./api/core";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "forgotPassword",
        element: <ForgotPassword />,
      },
      {
        path: "dashboard",
        element: <Dashboard></Dashboard>,
        children: [
          { path: "uptime", element: <Uptime></Uptime> },
          {
            path: "uptime/create",
            element: <Create />,
          },
          { path: "uptime/monitors/:id", element: <MonitorDetail /> },

          {
            path: "uptime/monitors/:id/edit",
            element: <Edit />,
          },
          { path: "account", element: <Account /> },
          { path: "account/security", element: <Security /> },
          { path: "account/security/totp", element: <Totp /> },
          { path: "admin/users", element: <Admin /> },
          {
            path: "admin/users/:id",
            element: <Detail />,
          },
          { path: "admin/users/create", element: <CreateAccount /> },
        ],
      },
      {
        path: "*",
        element: <NotFound></NotFound>,
      },
      {
        path: "",
        element: <NotFound></NotFound>,
      },
    ],
  },
]);

function NotFound() {
  const nav = useNavigate();
  useEffect(() => {
    nav("/signin");
  }, []);
  return <div>Not Found</div>;
}
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
