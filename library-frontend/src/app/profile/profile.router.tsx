import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import ProfilePage from "./index.tsx";
export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});
