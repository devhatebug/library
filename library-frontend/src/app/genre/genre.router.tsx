import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../router.tsx";
import { GenreItem } from "./genre-item/index.tsx";
import { GenreLayout } from "./genre.layout.tsx";
const _genreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/genre",
  component: GenreLayout,
});

export const genreRoute = _genreRoute.addChildren([
  createRoute({
    getParentRoute: () => _genreRoute,
    path: "/$genre",
    component: GenreItem,
  }),
]);
