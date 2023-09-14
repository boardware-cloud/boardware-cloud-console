import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
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
import monitorApi from "./api/monitor";
import Info from "./pages/Dashboard/Account/Info";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function loadMonitor({ params }: LoaderFunctionArgs) {
  return new Promise((resolve, reject) => {
    monitorApi.getMonitor({ id: params.id! }).then((monitor) => {
      resolve({ monitor: monitor });
    });
  });
}

function loadAccount() {
  return new Promise((resolve, reject) => {
    accountApi
      .getAccount()
      .then((account) => {
        resolve({ account: account });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function loadAccountById({ params }: LoaderFunctionArgs) {
  return new Promise((resolve, reject) => {
    accountApi
      .getAccountById({ id: params.id as string })
      .then((account) => {
        resolve({ account: account });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

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
        loader: loadAccount,
        element: <Dashboard></Dashboard>,
        children: [
          { path: "uptime", element: <Uptime></Uptime> },
          {
            path: "uptime/create",
            element: <Create />,
          },
          {
            path: "uptime/monitors/:id",
            element: <MonitorDetail />,
            loader: loadMonitor,
          },
          {
            path: "uptime/monitors/:id/edit",
            element: <Edit />,
            loader: loadMonitor,
          },
          { path: "account", element: <Account /> },
          { path: "account/security", element: <Security /> },
          { path: "account/security/totp", element: <Totp /> },
          { path: "account/info", element: <Info></Info>, loader: loadAccount },
          { path: "admin/users", element: <Admin /> },
          {
            path: "admin/users/:id",
            element: <Info />,
            loader: loadAccountById,
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
