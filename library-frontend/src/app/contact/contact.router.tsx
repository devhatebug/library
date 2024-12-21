import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import HelpContactPage from "./index.tsx";

export const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: HelpContactPage,
});
