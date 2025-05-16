
import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./src/pages/Index";
import NotFound from "./src/pages/NotFound";

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

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
