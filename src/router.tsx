import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
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
