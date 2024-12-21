import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import RecommendedPage from "./index.tsx";

export const recommendedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recommended",
  component: RecommendedPage,
});
