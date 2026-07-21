import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import UpdateChecker from "./components/system/UpdateChecker";

export default function App() {
  return (
    <>
      <UpdateChecker />
      <RouterProvider router={router} />
    </>
  );
}