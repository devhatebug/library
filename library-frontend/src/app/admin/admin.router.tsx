import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import AdminDashboard from "./index.tsx";
export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});
