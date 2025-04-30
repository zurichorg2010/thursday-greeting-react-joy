
import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import NotFound from "./pages/NotFound";

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

export const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
