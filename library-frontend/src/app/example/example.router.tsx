import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import { ExampleLayout } from "./example.layout.tsx";
import { ExampleIndex } from "./example_index/index.tsx";

const _exRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ExampleLayout,
});

export const exRouter = _exRoute.addChildren([
  createRoute({
    getParentRoute: () => _exRoute,
    path: "/children",
    component: ExampleIndex,
  }),
]);
