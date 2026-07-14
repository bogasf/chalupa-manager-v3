import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Visits from "../pages/Visits";
import Finance from "../pages/Finance";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "visits",
        element: <Visits />,
      },
      {
        path: "finance",
        element: <Finance />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;