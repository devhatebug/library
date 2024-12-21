import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import { NewsLayout } from "./news.layout.tsx";
import NewsPage from "./index.tsx";
import NewsDetailPage from "./news-item/index.tsx";

const _newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: NewsLayout,
});

export const newsRoute = _newsRoute.addChildren([
  createRoute({
    getParentRoute: () => _newsRoute,
    path: "/all",
    component: NewsPage,
  }),
  createRoute({
    getParentRoute: () => _newsRoute,
    path: "/$id",
    component: NewsDetailPage,
  }),
]);
