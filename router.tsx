
import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./src/pages/Index";
import SignupPage from "./src/pages/SignupPage";
import SigninPage from "./src/pages/SigninPage";
import OnboardingPage from "./src/pages/OnboardingPage";
import DashboardPage from "./src/pages/DashboardPage";
import BoardPage from "./src/pages/BoardPage";
import NotFound from "./src/pages/NotFound";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/board/:boardId",
    element: <BoardPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
