import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
          { path: "admin", element: <Admin /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Root />,
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
