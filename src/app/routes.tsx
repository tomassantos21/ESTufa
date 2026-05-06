import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Feed } from "./pages/Feed";
import { Scan } from "./pages/Scan";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Landing } from "./pages/Landing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: "feed", Component: Feed },
      { path: "scan", Component: Scan },
      { path: "profile", Component: Profile },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
]);
