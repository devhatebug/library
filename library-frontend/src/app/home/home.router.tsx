import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import HomePage from "./index.tsx";
export const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
